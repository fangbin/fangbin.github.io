/* ============================================================
   Landing visual — "Event Horizon"

   Layers
     .cosmos   CSS nebula (static, painted by the browser)
     #sky      canvas — depth starfield, cursor lensing, shock rims
     #flow     canvas — curl-noise filaments, additive, persistent trails
     #core     canvas — icosahedral core, gyro rings, shock rings
     .reticle  DOM   — trailing cursor instrument

   Everything reacts to the pointer. With no pointer yet, a synthetic
   focus point traces a slow Lissajous path so the field is never dead.
   Canvas 2D + DOM only. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;

  /* ---------------- theme ---------------- */

  try {
    var saved = localStorage.getItem('home-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  if (finePointer) document.body.classList.add('cursorless');

  /* ---------------- palette ---------------- */

  var PAL = {};
  function readPalette() {
    var cs = getComputedStyle(root);
    function v(name, fallback) {
      var s = cs.getPropertyValue(name).trim();
      return s || fallback;
    }
    PAL.ink = v('--ink', '70, 224, 255'); /* "r, g, b" */
    PAL.ink2 = v('--ink-2', '156, 132, 255');
    PAL.star = v('--star', '214, 240, 255');
    PAL.hot = v('--hot', '#dcf7ff');
    PAL.gold = v('--gold', '#e0bd6a');
    PAL.lock = v('--lock', '#62ffd2');
    PAL.hotRgb = v('--hot-rgb', '220, 247, 255');
    PAL.lockRgb = v('--lock-rgb', '98, 255, 210');
    PAL.goldRgb = v('--gold-rgb', '224, 189, 106');
    PAL.blend = v('--flow-blend', 'lighter');
    PAL.flowBoost = parseFloat(v('--flow-boost', '1')) || 1;
    PAL.fx = parseFloat(v('--fx', '1')) || 1;
    PAL.glowFx = parseFloat(v('--glow-fx', '1')) || 1;
    PAL.bg = v('--bg', '#03060c');
  }
  readPalette();

  function rgba(triple, a) {
    return 'rgba(' + triple + ',' + a + ')';
  }

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('home-theme', next);
      } catch (e) {}
      setTimeout(function () {
        readPalette();
        if (reduce) render(0, 0.016);
      }, 40);
    });
  }

  /* ---------------- perlin noise ---------------- */

  var perm = new Uint8Array(512);
  (function seed() {
    var p = new Uint8Array(256);
    var i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) {
      j = (Math.random() * (i + 1)) | 0;
      t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();

  function fadeC(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function grad2(h, x, y) {
    switch (h & 7) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x;
      case 5: return -x;
      case 6: return y;
      default: return -y;
    }
  }

  function pnoise(x, y) {
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var xf = x - X;
    var yf = y - Y;
    X &= 255;
    Y &= 255;
    var u = fadeC(xf);
    var v = fadeC(yf);
    var aa = perm[X + perm[Y]];
    var ba = perm[X + 1 + perm[Y]];
    var ab = perm[X + perm[Y + 1]];
    var bb = perm[X + 1 + perm[Y + 1]];
    var x1 = lerp(grad2(aa, xf, yf), grad2(ba, xf - 1, yf), u);
    var x2 = lerp(grad2(ab, xf, yf - 1), grad2(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v);
  }

  /* curl of a two-octave potential field — divergence-free, so the
     filaments never pile up into blobs */
  function curl(x, y, t) {
    /* translating the sample point drifts the whole field over time */
    x += t * 11;
    y += t * 7;
    var s = 0.0016;
    var e = 9;
    var x1 = x * s;
    var x2 = x * s * 2.35;
    var yU = (y + e) * s;
    var yD = (y - e) * s;
    var y1 = y * s;
    var y2 = y * s * 2.35;
    var u1 = (y + e) * s * 2.35;
    var u2 = (y - e) * s * 2.35;
    var a = pnoise(x1, yU) * 0.72 + pnoise(x2, u1) * 0.28;
    var b = pnoise(x1, yD) * 0.72 + pnoise(x2, u2) * 0.28;
    var c = pnoise((x + e) * s, y1) * 0.72 + pnoise((x + e) * s * 2.35, y2) * 0.28;
    var d = pnoise((x - e) * s, y1) * 0.72 + pnoise((x - e) * s * 2.35, y2) * 0.28;
    return [a - b, d - c];
  }

  /* ---------------- pointer ---------------- */

  var ptr = {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0, /* trailing (reticle ring) */
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    nx: 0,
    ny: 0, /* normalised -1..1 */
    speed: 0, /* px / s */
    flux: 0, /* smoothed 0..1 — drives CSS var --flux */
    inside: false,
    down: false,
    charge: 0
  };

  function focusAt(t) {
    /* no pointer yet → a synthetic focus tracing a slow Lissajous path */
    if (ptr.inside) return { x: ptr.x, y: ptr.y, s: 1 };
    return {
      x: window.innerWidth * (0.5 + 0.27 * Math.sin(t * 0.19)),
      y: window.innerHeight * (0.5 + 0.21 * Math.cos(t * 0.14)),
      s: 0.5
    };
  }

  /* ---------------- canvases ---------------- */

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var skyCv = document.getElementById('sky');
  var flowCv = document.getElementById('flow');
  var coreCv = document.getElementById('core');
  var sky = null;
  var flow = null;
  var core = null;

  function fit(cv) {
    if (!cv) return null;
    var r = cv.getBoundingClientRect();
    var w = Math.max(1, r.width);
    var h = Math.max(1, r.height);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------------- stars ---------------- */

  var stars = [];

  function buildStars() {
    if (!sky) return;
    var n = sky.w < 720 ? 180 : sky.w < 1300 ? 330 : 470;
    stars = [];
    for (var i = 0; i < n; i++) {
      var d = 0.22 + Math.random() * 0.78; /* depth: far → near */
      stars.push({
        x: Math.random(),
        y: Math.random(),
        d: d,
        r: 0.45 + d * 1.45,
        tw: Math.random() * TAU,
        fl: Math.random() < 0.05 /* flare star */
      });
    }
  }

  /* ---------------- flow particles ---------------- */

  var parts = [];

  function buildParticles() {
    if (!flow) return;
    var n = flow.w < 720 ? 300 : flow.w < 1300 ? 600 : 880;
    parts = [];
    for (var i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * flow.w,
        y: Math.random() * flow.h,
        px: 0,
        py: 0,
        d: 0.3 + Math.random() * 0.7,
        sp: 0.55 + Math.random() * 0.85
      });
    }
    for (var k = 0; k < parts.length; k++) {
      parts[k].px = parts[k].x;
      parts[k].py = parts[k].y;
    }
    flow.ctx.clearRect(0, 0, flow.w, flow.h);
  }

  /* ---------------- shockwaves ---------------- */

  var shocks = [];

  function spawnShock(x, y, power, layer) {
    if (shocks.length > 10) shocks.shift();
    shocks.push({ x: x, y: y, r: 4, a: 0.9 * power, layer: layer || 'sky', power: power });
  }

  /* ---------------- core geometry ---------------- */

  var PHI = (1 + Math.sqrt(5)) / 2;
  var IV = (function () {
    var raw = [
      [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
      [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
      [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]
    ];
    return raw.map(function (p) {
      var L = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
      return [p[0] / L, p[1] / L, p[2] / L];
    });
  })();

  var IE = (function () {
    var out = [];
    for (var i = 0; i < IV.length; i++) {
      for (var j = i + 1; j < IV.length; j++) {
        var dx = IV[i][0] - IV[j][0];
        var dy = IV[i][1] - IV[j][1];
        var dz = IV[i][2] - IV[j][2];
        var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > 0.9 && d < 1.2) out.push([i, j]);
      }
    }
    return out;
  })();

  var RINGS = [
    { r: 1.32, squash: 0.30, tilt: 0.24, sp: 0.26 },
    { r: 1.16, squash: 0.20, tilt: -0.66, sp: -0.38 },
    { r: 1.5, squash: 0.36, tilt: 1.02, sp: 0.15 }
  ];

  var rot = { x: 0.3, y: 0 };

  /* The page never scrolls, so these rects only change on resize.
     Caching them keeps the render loop off the layout path. */
  var coreRect = null;
  var enterRect = null;

  function refreshRects() {
    coreRect = coreCv ? coreCv.getBoundingClientRect() : null;
    enterRect = enterEl ? enterEl.getBoundingClientRect() : null;
  }

  /* distance from the pointer to the core centre, normalised to 0..1 */
  function coreProx(t) {
    if (t === undefined) t = 0;
    if (!coreRect) return 0;
    var r = coreRect;
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var f = focusAt(t);
    var span = Math.max(r.width, r.height) * 0.62;
    var d = Math.sqrt((f.x - cx) * (f.x - cx) + (f.y - cy) * (f.y - cy));
    var p = 1 - d / span;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  /* ---------------- draw · sky ---------------- */

  function drawSky(t, dt) {
    var ctx = sky.ctx;
    ctx.clearRect(0, 0, sky.w, sky.h);

    var f = focusAt(t);
    var lensR = Math.min(sky.w, sky.h) * 0.3 + 70;
    var fx = f.x;
    var fy = f.y;
    var px = ptr.nx * 34;
    var py = ptr.ny * 22;

    /* the gravity well itself */
    if (f.s > 0.1) {
      var halo = ctx.createRadialGradient(fx, fy, 0, fx, fy, lensR * 1.7);
      halo.addColorStop(0, rgba(PAL.ink, 0.10 * f.s));
      halo.addColorStop(0.5, rgba(PAL.ink2, 0.04 * f.s));
      halo.addColorStop(1, rgba(PAL.ink, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(fx, fy, lensR * 1.7, 0, TAU);
      ctx.fill();
    }

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var x = s.x * sky.w + px * s.d + Math.sin(t * 0.05 + s.tw) * 3 * s.d;
      var y = s.y * sky.h + py * s.d + Math.cos(t * 0.042 + s.tw * 1.3) * 3 * s.d;

      /* gravitational lensing — stars are pushed away from the focus */
      if (f.s > 0.1) {
        var dx = x - fx;
        var dy = y - fy;
        var d2 = dx * dx + dy * dy;
        if (d2 < lensR * lensR && d2 > 0.5) {
          var dd = Math.sqrt(d2);
          var w = 1 - dd / lensR;
          w = w * w * (1 + ptr.flux * 0.8) * f.s;
          var k = (w * lensR * 0.3) / dd;
          x += dx * k;
          y += dy * k;
        }
      }

      var q, sh, sdx, sdy, sdd, band;
      for (q = 0; q < shocks.length; q++) {
        sh = shocks[q];
        if (sh.layer !== 'sky') continue;
        sdx = x - sh.x;
        sdy = y - sh.y;
        sdd = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
        band = Math.abs(sdd - sh.r);
        if (band < 110) {
          var push = (1 - band / 110) * sh.a * 26 * s.d;
          x += (sdx / sdd) * push;
          y += (sdy / sdd) * push;
        }
      }

      var tw = 0.5 + 0.5 * Math.sin(t * (0.6 + s.d * 0.9) + s.tw);
      var a = (0.14 + 0.7 * s.d) * (0.45 + 0.55 * tw);

      if (s.fl) {
        var len = 5 + s.d * 9;
        ctx.strokeStyle = rgba(PAL.star, a * 0.55);
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - len, y);
        ctx.lineTo(x + len, y);
        ctx.moveTo(x, y - len);
        ctx.lineTo(x, y + len);
        ctx.stroke();
        ctx.fillStyle = rgba(PAL.star, a);
        ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
      } else {
        ctx.fillStyle = rgba(PAL.star, a);
        ctx.fillRect(x, y, s.r, s.r);
      }
    }

    /* lens rim — dashed, slowly counter-rotating */
    if (f.s > 0.35) {
      ctx.save();
      ctx.translate(fx, fy);
      ctx.strokeStyle = rgba(PAL.ink, 0.20 * f.s);
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 11]);
      ctx.rotate(-t * 0.12);
      ctx.beginPath();
      ctx.arc(0, 0, lensR, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.4;
      for (var k = 0; k < 4; k++) {
        var a0 = (k / 4) * TAU;
        ctx.beginPath();
        ctx.arc(0, 0, lensR, a0, a0 + 0.13);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* shock rims on the sky layer */
    for (var z = 0; z < shocks.length; z++) {
      var sv = shocks[z];
      if (sv.layer !== 'sky') continue;
      ctx.strokeStyle = rgba(PAL.ink, sv.a * 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sv.x, sv.y, sv.r, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = rgba(PAL.ink2, sv.a * 0.28);
      ctx.beginPath();
      ctx.arc(sv.x, sv.y, sv.r * 0.72, 0, TAU);
      ctx.stroke();
    }
  }

  /* ---------------- draw · flow ---------------- */

  function drawFlow(t, dt) {
    var ctx = flow.ctx;
    var f = focusAt(t);

    /* fade instead of clearing: keeps the canvas transparent so the
       nebula shows through, while the filaments smear into trails */
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, 0.062 * (dt * 60)) + ')';
    ctx.fillRect(0, 0, flow.w, flow.h);

    ctx.globalCompositeOperation = PAL.blend;
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';

    var vr = Math.min(flow.w, flow.h) * 0.32 + 90;
    var swirl = (46 + ptr.flux * 130) * f.s;
    var pull = (20 + ptr.flux * 80) * f.s;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var c = curl(p.x, p.y, t);
      var m = Math.sqrt(c[0] * c[0] + c[1] * c[1]) || 1;
      var scale = (34 + 78 * p.d) * p.sp;
      var vx = (c[0] / m) * scale;
      var vy = (c[1] / m) * scale;

      if (f.s > 0.1) {
        var dx = f.x - p.x;
        var dy = f.y - p.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < vr * vr && d2 > 16) {
          var dd = Math.sqrt(d2);
          var w = 1 - dd / vr;
          w = w * w;
          vx += (-dy / dd) * swirl * w + (dx / dd) * pull * w;
          vy += (dx / dd) * swirl * w + (dy / dd) * pull * w;
        } else if (d2 <= 16) {
          /* dead centre — eject outward so nothing collapses to a dot */
          vx += (Math.random() - 0.5) * 90;
          vy += (Math.random() - 0.5) * 90;
        }
      }

      for (var q = 0; q < shocks.length; q++) {
        var sv = shocks[q];
        var ax = p.x - sv.x;
        var ay = p.y - sv.y;
        var ad = Math.sqrt(ax * ax + ay * ay) || 1;
        var band = Math.abs(ad - sv.r);
        if (band < 120) {
          var g = (1 - band / 120) * sv.a * 300;
          vx += (ax / ad) * g;
          vy += (ay / ad) * g;
        }
      }

      var nx = p.x + vx * dt;
      var ny = p.y + vy * dt;

      if (nx < -40) nx = flow.w + 40;
      else if (nx > flow.w + 40) nx = -40;
      if (ny < -40) ny = flow.h + 40;
      else if (ny > flow.h + 40) ny = -40;

      /* skip the segment across a wrap so we never draw a full-width streak */
      if (Math.abs(nx - p.px) < 200 && Math.abs(ny - p.py) < 200) {
        var a = (0.045 + 0.15 * p.d) * PAL.flowBoost;
        ctx.strokeStyle = p.d > 0.68 ? rgba(PAL.ink, a) : rgba(PAL.ink2, a * 0.85);
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }

      p.px = p.x;
      p.py = p.y;
      p.x = nx;
      p.y = ny;
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------------- draw · core ---------------- */

  /* The 20 triangular faces, derived from the edge graph. Filling them
     with depth sorting is what makes the wireframe read as a solid. */
  var FACES = (function () {
    var adj = [];
    var i, j, k;
    for (i = 0; i < IV.length; i++) adj.push({});
    for (k = 0; k < IE.length; k++) {
      adj[IE[k][0]][IE[k][1]] = 1;
      adj[IE[k][1]][IE[k][0]] = 1;
    }
    var out = [];
    for (i = 0; i < IV.length; i++) {
      for (j = i + 1; j < IV.length; j++) {
        if (!adj[i][j]) continue;
        for (k = j + 1; k < IV.length; k++) {
          if (adj[i][k] && adj[j][k]) out.push([i, j, k]);
        }
      }
    }
    return out;
  })();

  var order = [];

  function tether(ctx, cx, cy, prox, t) {
    if (prox <= 0.42) return;
    var fr = coreRect;
    if (!fr) return;
    var mx = ptr.inside ? ptr.x - fr.left : cx + Math.sin(t * 0.5) * 46;
    var my = ptr.inside ? ptr.y - fr.top : cy;
    ctx.strokeStyle = rgba(PAL.lockRgb, (prox - 0.42) * 0.95);
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.lineDashOffset = -t * 24;
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.beginPath();
    ctx.arc(mx, my, 3, 0, TAU);
    ctx.stroke();
  }

  function drawCore(t, dt) {
    var ctx = core.ctx;
    var w = core.w;
    var h = core.h;
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h / 2;
    var prox = coreProx(t);
    var chg = ptr.charge;

    var breathe = 1 + 0.016 * Math.sin(t * 0.7);
    var R = Math.min(w, h) * 0.275 * breathe * (1 + 0.05 * prox + 0.05 * chg);

    /* orientation follows the pointer; drifts on its own when idle */
    var rxT = ptr.ny * 0.85 + Math.sin(t * 0.13) * 0.16;
    var ryT = t * 0.2 + ptr.nx * 1.05;
    var k = Math.min(1, dt * 3.4);
    rot.x += (rxT - rot.x) * k;
    rot.y += (ryT - rot.y) * k;

    var cosX = Math.cos(rot.x);
    var sinX = Math.sin(rot.x);
    var cosY = Math.cos(rot.y);
    var sinY = Math.sin(rot.y);

    /* halo */
    var haloR = R * (1.6 + prox * 0.3 + chg * 0.24);
    var ha = (0.05 + 0.09 * prox + 0.13 * chg) * PAL.glowFx;
    var halo = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, haloR);
    halo.addColorStop(0, rgba(PAL.ink, ha));
    halo.addColorStop(0.42, rgba(PAL.ink2, ha * 0.42));
    halo.addColorStop(1, rgba(PAL.ink, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, TAU);
    ctx.fill();

    /* nucleus — a small hot spark inside a wide soft bloom */
    var nucR = R * (0.085 + 0.06 * prox + 0.09 * chg);
    var nuc = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucR * 5.2);
    nuc.addColorStop(0, rgba(PAL.hotRgb, (0.34 + 0.32 * prox + 0.24 * chg) * PAL.glowFx));
    nuc.addColorStop(0.16, rgba(PAL.ink, (0.2 + 0.24 * prox) * PAL.glowFx));
    nuc.addColorStop(1, rgba(PAL.ink, 0));
    ctx.fillStyle = nuc;
    ctx.beginPath();
    ctx.arc(cx, cy, nucR * 5.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = PAL.hot;
    ctx.globalAlpha = (0.42 + 0.45 * prox) * PAL.fx;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, nucR * 0.5), 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    /* gyro rings — glow pass then crisp pass */
    ctx.save();
    ctx.translate(cx, cy);
    for (var r = 0; r < RINGS.length; r++) {
      var rg = RINGS[r];
      var spin = t * rg.sp * (1 + prox * 0.9 + chg * 1.4);
      ctx.save();
      ctx.rotate(rg.tilt + Math.sin(spin * 0.4) * 0.4);
      var rrx = R * rg.r;
      var rry = R * rg.r * rg.squash;
      var rcol = r === 0 ? PAL.goldRgb : PAL.ink;
      var rbase = r === 0 ? 0.44 : 0.3;

      ctx.globalAlpha = rbase * 0.28 * PAL.glowFx;
      ctx.strokeStyle = 'rgb(' + rcol + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, rrx, rry, 0, 0, TAU);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba(rcol, rbase * (1 + 0.4 * prox));
      ctx.lineWidth = 1;
      ctx.setLineDash(r === 0 ? [2, 9] : [16, 8]);
      ctx.beginPath();
      ctx.ellipse(0, 0, rrx, rry, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      /* satellite riding the ring */
      var sx = Math.cos(spin) * rrx;
      var sy = Math.sin(spin) * rry;
      ctx.fillStyle = r === 0 ? PAL.gold : PAL.hot;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    /* gauge ticks on the outer ring */
    ctx.save();
    ctx.rotate(t * 0.18);
    ctx.strokeStyle = rgba(PAL.goldRgb, 0.5);
    ctx.lineWidth = 1.4;
    for (var tk = 0; tk < 12; tk++) {
      var a0 = (tk / 12) * TAU;
      var ln = tk % 3 === 0 ? 0.12 : 0.055;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.5, a0, a0 + ln);
      ctx.stroke();
    }
    ctx.restore();

    /* charge gauge — segments light up while the pointer is held */
    if (chg > 0.01) {
      ctx.save();
      ctx.rotate(-Math.PI / 2);
      var SEG = 48;
      var lit = Math.round(SEG * chg);
      var cRad = R * 1.64;
      ctx.lineWidth = 1.6;
      for (var c2 = 0; c2 < SEG; c2++) {
        var ca = (c2 / SEG) * TAU;
        ctx.strokeStyle =
          c2 < lit ? rgba(PAL.hotRgb, 0.3 + 0.45 * chg) : rgba(PAL.ink, 0.13);
        ctx.beginPath();
        ctx.arc(0, 0, cRad, ca, ca + 0.055);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();

    /* project the solid — one uniform unfold so it stays a solid */
    var grow = 1 + 0.13 * prox + 0.09 * chg;
    var pts = [];
    for (var i = 0; i < IV.length; i++) {
      var x = IV[i][0];
      var y = IV[i][1];
      var z = IV[i][2];
      var x1 = x * cosY + z * sinY;
      var z1 = -x * sinY + z * cosY;
      var y1 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;
      var persp = 3.2 / (3.2 + z2);
      pts.push({ x: cx + x1 * R * persp * grow, y: cy + y1 * R * persp * grow, z: z2 });
    }

    /* depth-sorted translucent faces, far to near */
    order.length = 0;
    for (var f = 0; f < FACES.length; f++) {
      order.push({
        f: f,
        z: (pts[FACES[f][0]].z + pts[FACES[f][1]].z + pts[FACES[f][2]].z) / 3
      });
    }
    order.sort(function (a, b) {
      return b.z - a.z;
    });

    for (var q = 0; q < order.length; q++) {
      var tri = FACES[order[q].f];
      var tz = order[q].z;
      var tnear = 1 - (tz + 1) * 0.5;
      var pa = pts[tri[0]];
      var pb = pts[tri[1]];
      var pc = pts[tri[2]];
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineTo(pc.x, pc.y);
      ctx.closePath();
      ctx.fillStyle =
        tz < 0
          ? rgba(PAL.ink, (0.012 + 0.05 * tnear) * (1 + 0.9 * prox + 0.7 * chg))
          : rgba(PAL.ink2, (0.008 + 0.032 * tnear) * (1 + 0.9 * prox + 0.7 * chg));
      ctx.fill();
      ctx.strokeStyle = rgba(PAL.ink, (0.03 + 0.12 * tnear) * (1 + 0.7 * prox));
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    /* crisp edges on top — squared depth falloff gives a real gradient */
    for (var pass = 0; pass < 2; pass++) {
      ctx.lineWidth = pass === 0 ? 4 : 1.05;
      for (var e = 0; e < IE.length; e++) {
        var ea = pts[IE[e][0]];
        var eb = pts[IE[e][1]];
        var depth = (ea.z + eb.z) * 0.5;
        var nearE = 1 - (depth + 1) * 0.5;
        var alpha = (0.05 + 0.95 * nearE * nearE) * (1 + 0.45 * prox + 0.4 * chg);
        if (alpha > 1) alpha = 1;
        var col = depth < 0 ? PAL.ink : PAL.ink2;
        if (pass === 0) {
          ctx.globalAlpha = alpha * 0.13 * PAL.fx;
          ctx.strokeStyle = 'rgb(' + col + ')';
        } else {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = rgba(col, alpha);
        }
        ctx.beginPath();
        ctx.moveTo(ea.x, ea.y);
        ctx.lineTo(eb.x, eb.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    /* inner counter-shell, revealed on approach */
    if (prox > 0.06) {
      ctx.save();
      ctx.globalAlpha = prox * 0.6;
      ctx.strokeStyle = rgba(PAL.ink, 0.5);
      ctx.lineWidth = 0.8;
      for (var s2 = 0; s2 < IE.length; s2++) {
        var s1a = pts[IE[s2][0]];
        var s1b = pts[IE[s2][1]];
        ctx.beginPath();
        ctx.moveTo(cx + (s1a.x - cx) * 0.44, cy + (s1a.y - cy) * 0.44);
        ctx.lineTo(cx + (s1b.x - cx) * 0.44, cy + (s1b.y - cy) * 0.44);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    /* vertices */
    for (var v = 0; v < pts.length; v++) {
      var pv = pts[v];
      var tw = 0.5 + 0.5 * Math.sin(t * 1.5 + v * 1.7);
      var nearV = 1 - (pv.z + 1) * 0.5;
      var rad = 0.9 + 0.8 * nearV + 0.5 * prox;
      if (nearV > 0.45) {
        var vg = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, rad * 7);
        vg.addColorStop(0, rgba(PAL.hotRgb, 0.26 * tw * nearV * PAL.fx));
        vg.addColorStop(1, rgba(PAL.hotRgb, 0));
        ctx.fillStyle = vg;
        ctx.beginPath();
        ctx.arc(pv.x, pv.y, rad * 7, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = nearV > 0.55 ? PAL.hot : PAL.gold;
      ctx.globalAlpha = 0.28 + 0.62 * tw;
      ctx.beginPath();
      ctx.arc(pv.x, pv.y, rad, 0, TAU);
      ctx.fill();
      if (prox > 0.45) {
        ctx.globalAlpha = (prox - 0.45) * 0.9;
        ctx.beginPath();
        ctx.arc(pv.x, pv.y, rad * 3.6, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    tether(ctx, cx, cy, prox, t);

    /* shock rings that belong to the core layer */
    for (var z2 = 0; z2 < shocks.length; z2++) {
      var sv2 = shocks[z2];
      if (sv2.layer !== 'core') continue;
      ctx.strokeStyle = rgba(PAL.hotRgb, sv2.a * 0.65);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, sv2.r, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = rgba(PAL.ink, sv2.a * 0.34);
      ctx.beginPath();
      ctx.arc(cx, cy, sv2.r * 1.35, 0, TAU);
      ctx.stroke();
    }
  }

  /* ---------------- physics ---------------- */

  function stepShocks(dt) {
    for (var i = shocks.length - 1; i >= 0; i--) {
      var s = shocks[i];
      s.r += (420 + 900 * s.power) * dt;
      s.a -= 1.15 * dt;
      if (s.a <= 0) shocks.splice(i, 1);
    }
  }

  /* ---------------- reticle + hud ---------------- */

  var reticle = document.getElementById('reticle');
  var rtPrecise = reticle ? reticle.querySelector('.rt-precise') : null;
  var rtTrail = reticle ? reticle.querySelector('.rt-trail') : null;
  var rtTag = reticle ? reticle.querySelector('.rt-tag') : null;

  var hFlow = document.getElementById('h-flow');
  var hFlux = document.getElementById('h-flux');
  var hPhase = document.getElementById('h-phase');
  var hX = document.getElementById('h-x');
  var hY = document.getElementById('h-y');
  var hVel = document.getElementById('h-vel');
  var hLock = document.getElementById('h-lock');

  var pad = function (n, len) {
    var s = String(Math.round(n));
    while (s.length < len) s = '0' + s;
    return s;
  };

  function updateHud(t, prox, state) {
    if (hFlow) hFlow.textContent = pad(parts.length, 4);
    if (hFlux) hFlux.textContent = ptr.flux.toFixed(2);
    if (hPhase) hPhase.textContent = state;
    if (hX) hX.textContent = pad(ptr.x, 4);
    if (hY) hY.textContent = pad(ptr.y, 4);
    if (hVel) hVel.textContent = (ptr.speed / 100).toFixed(2);
    if (hLock) hLock.textContent = prox > 0.55 ? 'LOCK' : '—';
  }

  /* ---------------- frame ---------------- */

  var state = 'DRIFT';

  function render(t, dt) {
    if (!sky || !flow || !core) return;

    var prox = coreProx(t);

    /* smoothed speed → flux drives the CSS-side reactive bits */
    var target = ptr.inside ? Math.min(1, ptr.speed / 1400) : 0.12 + 0.1 * Math.sin(t * 0.8);
    ptr.flux += (target - ptr.flux) * Math.min(1, dt * 5);
    root.style.setProperty('--flux', ptr.flux.toFixed(3));

    if (ptr.down) {
      ptr.charge = Math.min(1, ptr.charge + dt * 1.5);
    } else {
      ptr.charge = Math.max(0, ptr.charge - dt * 4);
    }

    root.style.setProperty('--core-glow', (prox * 0.6 + ptr.charge * 0.7).toFixed(3));

    /* velocity decay when the pointer stops */
    ptr.speed *= Math.max(0, 1 - dt * 6);

    state = ptr.down
      ? 'CHARGE'
      : prox > 0.55
        ? 'LOCK'
        : ptr.speed > 220
          ? 'TRACE'
          : 'DRIFT';

    stepShocks(dt);
    drawSky(t, dt);
    drawFlow(t, dt);
    drawCore(t, dt);

    /* reticle — trailing ring, exact dot */
    if (reticle && ptr.inside) {
      reticle.classList.add('on');
      var kk = Math.min(1, dt * 11);
      ptr.lx += (ptr.x - ptr.lx) * kk;
      ptr.ly += (ptr.y - ptr.ly) * kk;
      if (rtPrecise) rtPrecise.style.transform = 'translate3d(' + ptr.x + 'px,' + ptr.y + 'px,0)';
      if (rtTrail) rtTrail.style.transform = 'translate3d(' + ptr.lx + 'px,' + ptr.ly + 'px,0)';
      reticle.setAttribute(
        'data-state',
        ptr.down ? 'press' : overEnter ? 'open' : prox > 0.55 ? 'lock' : 'idle'
      );
      if (rtTag) {
        rtTag.textContent = ptr.down
          ? 'CHARGE ' + Math.round(ptr.charge * 100) + '%'
          : overEnter
            ? 'OPEN'
            : prox > 0.55
              ? 'LOCK'
              : state;
      }
      root.setAttribute('data-lock', prox > 0.55 ? '1' : '0');
    } else if (reticle) {
      reticle.classList.remove('on');
    }

    updateHud(t, prox, state);
  }

  /* ---------------- loop ---------------- */

  var t0 = performance.now();
  var last = t0;
  var raf = null;

  function loop(now) {
    var t = (now - t0) / 1000;
    var dt = (now - last) / 1000;
    last = now;
    if (dt > 0.06) dt = 0.06;
    if (dt < 0.0005) dt = 0.016;
    render(t, dt);
    raf = requestAnimationFrame(loop);
  }

  /* ---------------- events ---------------- */

  var overEnter = false;

  var enterEl = document.querySelector('.enter');
  if (enterEl) {
    enterEl.addEventListener('pointerenter', function () {
      overEnter = true;
    });
    enterEl.addEventListener('pointerleave', function () {
      overEnter = false;
      enterEl.style.setProperty('--mx', '0px');
      enterEl.style.setProperty('--my', '0px');
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    sky = fit(skyCv);
    flow = fit(flowCv);
    core = fit(coreCv);
    refreshRects();
    buildStars();
    buildParticles();
    if (reduce) render(0, 0.016);
  }

  var rt = null;
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(rt);
      rt = setTimeout(resize, 140);
    },
    { passive: true }
  );

  window.addEventListener(
    'pointermove',
    function (e) {
      if (!ptr.inside) {
        ptr.x = ptr.lx = e.clientX;
        ptr.y = ptr.ly = e.clientY;
      }
      ptr.lastX = ptr.x;
      ptr.lastY = ptr.y;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.nx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ny = (e.clientY / window.innerHeight) * 2 - 1;
      ptr.speed = Math.sqrt(
        (ptr.x - ptr.lastX) * (ptr.x - ptr.lastX) + (ptr.y - ptr.lastY) * (ptr.y - ptr.lastY)
      ) * 60;
      ptr.inside = true;

      /* magnetic pull on the Enter bar */
      if (enterEl && enterRect && !reduce) {
        var r = enterRect;
        var ex = r.left + r.width / 2;
        var ey = r.top + r.height / 2;
        var dx = e.clientX - ex;
        var dy = e.clientY - ey;
        var d = Math.sqrt(dx * dx + dy * dy);
        var reach = Math.max(r.width, 260) * 1.15;
        if (d < reach) {
          var pull = (1 - d / reach) * 11;
          enterEl.style.setProperty('--mx', ((dx / (d || 1)) * pull).toFixed(1) + 'px');
          enterEl.style.setProperty('--my', ((dy / (d || 1)) * pull).toFixed(1) + 'px');
        } else {
          enterEl.style.setProperty('--mx', '0px');
          enterEl.style.setProperty('--my', '0px');
        }
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'pointerdown',
    function (e) {
      if (reduce) return;
      ptr.down = true;
    },
    { passive: true }
  );

  window.addEventListener(
    'pointerup',
    function (e) {
      if (reduce) return;
      if (ptr.down) {
        var power = 0.35 + 0.65 * ptr.charge;
        spawnShock(e.clientX, e.clientY, power, 'sky');
        if (coreProx() > 0.45 && coreRect) {
          spawnShock(
            coreRect.left + coreRect.width / 2,
            coreRect.top + coreRect.height / 2,
            power,
            'core'
          );
        }
      }
      ptr.down = false;
      ptr.charge = 0;
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', function () {
    ptr.inside = false;
    ptr.down = false;
    if (reticle) reticle.classList.remove('on');
  });

  window.addEventListener('blur', function () {
    ptr.inside = false;
    ptr.down = false;
    ptr.nx = 0;
    ptr.ny = 0;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!reduce && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });

  /* ---------------- boot ---------------- */

  resize();
  if (reduce) {
    render(0, 0.016);
  } else {
    raf = requestAnimationFrame(loop);
  }
})();
