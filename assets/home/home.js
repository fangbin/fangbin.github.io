/* ============================================================
   Home visual — "Proof Constellation"
   Layer 0 : perspective grid receding to a horizon
   Layer 1 : drifting automaton graph with travelling tokens
   Layer 2 : slow wireframe icosahedron (the core mark)
   No dependencies. Canvas 2D only.
   ============================================================ */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------------- theme ---------------- */

  try {
    var saved = localStorage.getItem('home-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  var PAL = {};
  function readPalette() {
    var cs = getComputedStyle(root);
    function v(name, fallback) {
      var s = cs.getPropertyValue(name).trim();
      return s || fallback;
    }
    PAL.grid = v('--grid', 'rgba(80,220,180,.06)');
    PAL.gridStrong = v('--grid-strong', 'rgba(80,220,180,.12)');
    PAL.node = v('--node', '62, 224, 176'); /* "r, g, b" */
    PAL.pulse = v('--pulse', '#9ff5d6');
    PAL.wire = v('--wire', '#d8b45a');
    PAL.wire2 = v('--wire-2', '#3ee0b0');
    PAL.bg = v('--bg', '#04070b');
  }
  readPalette();

  function rgba(rgbCsv, a) {
    return 'rgba(' + rgbCsv + ',' + a + ')';
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
        if (reduce) render(0);
      }, 30);
    });
  }

  /* ---------------- canvas plumbing ---------------- */

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var bgCv = document.getElementById('bg');
  var coreCv = document.getElementById('core');
  var bg = null;
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

  /* ---------------- automaton graph ---------------- */

  var nodes = [];
  var pulses = [];
  var ripples = [];
  var mouse = { nx: 0, ny: 0, px: -9999, py: -9999 };

  function buildNodes() {
    if (!bg) return;
    var count = bg.w < 720 ? 32 : bg.w < 1200 ? 52 : 68;
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * bg.w,
        y: Math.random() * bg.h,
        vx: (Math.random() - 0.5) * 0.17,
        vy: (Math.random() - 0.5) * 0.17,
        r: 0.8 + Math.random() * 1.25,
        ph: Math.random() * Math.PI * 2
      });
    }
    pulses = [];
  }

  function linkDistance() {
    return Math.min(Math.max(Math.min(bg.w, bg.h) * 0.26, 120), 230);
  }

  function stepNodes() {
    var L = linkDistance();
    var R = 190;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      /* gentle attraction toward the pointer — the graph leans in */
      var dx = mouse.px - n.x;
      var dy = mouse.py - n.y;
      var d2 = dx * dx + dy * dy;
      if (mouse.px > -900 && d2 < R * R && d2 > 1) {
        var f = (1 - Math.sqrt(d2) / R) * 0.05;
        n.x += dx * f * 0.05;
        n.y += dy * f * 0.05;
      }

      if (n.x < -20) n.x = bg.w + 20;
      if (n.x > bg.w + 20) n.x = -20;
      if (n.y < -20) n.y = bg.h + 20;
      if (n.y > bg.h + 20) n.y = -20;
    }

    /* spawn a token on some currently-valid edge */
    if (!reduce && pulses.length < 26 && Math.random() < 0.075) {
      var a = (Math.random() * nodes.length) | 0;
      var b = (Math.random() * nodes.length) | 0;
      if (a !== b) {
        var p = nodes[a];
        var q = nodes[b];
        var ddx = p.x - q.x;
        var ddy = p.y - q.y;
        if (ddx * ddx + ddy * ddy < L * L) {
          pulses.push({ a: a, b: b, t: 0, sp: 0.005 + Math.random() * 0.009 });
        }
      }
    }

    for (var k = pulses.length - 1; k >= 0; k--) {
      pulses[k].t += pulses[k].sp;
      if (pulses[k].t >= 1) pulses.splice(k, 1);
    }
  }

  /* ---------------- drawing: background ---------------- */

  function drawGrid(t) {
    var ctx = bg.ctx;
    var horizon = bg.h * 0.46;
    var px = mouse.nx * 12;
    var py = mouse.ny * 6;

    /* receding horizontals, accelerating toward the viewer */
    var N = 22;
    ctx.lineWidth = 1;
    ctx.strokeStyle = PAL.grid;
    for (var i = 0; i < N; i++) {
      var p = (i / N + t * 0.028) % 1;
      var y = horizon + (bg.h - horizon) * (p * p);
      ctx.globalAlpha = 0.08 + 1.05 * p * p;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(bg.w, y);
      ctx.stroke();
    }

    /* converging verticals */
    var cx = bg.w * 0.5 + px;
    var M = 18;
    for (var j = -M; j <= M; j++) {
      var xFar = cx + j * (bg.w * 0.016);
      var xNear = cx + j * (bg.w * 0.56);
      ctx.globalAlpha = 0.62;
      ctx.beginPath();
      ctx.moveTo(xFar, horizon + py);
      ctx.lineTo(xNear, bg.h);
      ctx.stroke();
    }

    /* horizon hairline */
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = PAL.gridStrong;
    ctx.beginPath();
    ctx.moveTo(0, horizon + py);
    ctx.lineTo(bg.w, horizon + py);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawGraph(t) {
    var ctx = bg.ctx;
    var L = linkDistance();
    var px = mouse.nx * 10;
    var py = mouse.ny * 10;
    var i, j;

    /* edges */
    ctx.lineWidth = 0.7;
    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 > L * L) continue;
        var d = Math.sqrt(d2);
        var alpha = (1 - d / L) * 0.5;
        ctx.strokeStyle = rgba(PAL.node, alpha * 0.55);
        ctx.beginPath();
        ctx.moveTo(a.x + px, a.y + py);
        ctx.lineTo(b.x + px, b.y + py);
        ctx.stroke();
      }
    }

    /* nodes */
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var tw = 0.55 + 0.45 * Math.sin(t * 1.1 + n.ph);
      ctx.fillStyle = rgba(PAL.node, 0.3 + 0.45 * tw);
      ctx.beginPath();
      ctx.arc(n.x + px, n.y + py, n.r * (0.9 + 0.25 * tw), 0, Math.PI * 2);
      ctx.fill();
    }

    /* travelling tokens */
    for (i = 0; i < pulses.length; i++) {
      var pu = pulses[i];
      var p1 = nodes[pu.a];
      var p2 = nodes[pu.b];
      if (!p1 || !p2) continue;
      var e = pu.t * pu.t * (3 - 2 * pu.t); /* smoothstep */
      var x = p1.x + (p2.x - p1.x) * e + px;
      var y = p1.y + (p2.y - p1.y) * e + py;
      var fade = Math.sin(pu.t * Math.PI);
      var g = ctx.createRadialGradient(x, y, 0, x, y, 7);
      g.addColorStop(0, rgba(PAL.node, 0.85 * fade));
      g.addColorStop(1, rgba(PAL.node, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.pulse;
      ctx.globalAlpha = 0.85 * fade;
      ctx.beginPath();
      ctx.arc(x, y, 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawRipples() {
    var ctx = bg.ctx;
    for (var i = ripples.length - 1; i >= 0; i--) {
      var r = ripples[i];
      r.rad += 3.4;
      r.a -= 0.012;
      if (r.a <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = rgba(PAL.node, r.a * 0.55);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.rad, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /* ---------------- drawing: core ---------------- */

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

  function drawCore(t) {
    var ctx = core.ctx;
    var w = core.w;
    var h = core.h;
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h / 2;
    var breathe = 1 + 0.022 * Math.sin(t * 0.6);
    var R = Math.min(w, h) * 0.365 * breathe;

    var rx = t * 0.16 + mouse.ny * 0.42;
    var ry = t * 0.23 + mouse.nx * 0.55;
    var cosX = Math.cos(rx);
    var sinX = Math.sin(rx);
    var cosY = Math.cos(ry);
    var sinY = Math.sin(ry);

    var pts = [];
    for (var i = 0; i < IV.length; i++) {
      var x = IV[i][0];
      var y = IV[i][1];
      var z = IV[i][2];
      var x1 = x * cosY + z * sinY;
      var z1 = -x * sinY + z * cosY;
      var y1 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;
      var persp = 3.1 / (3.1 + z2);
      pts.push({
        x: cx + x1 * R * persp,
        y: cy + y1 * R * persp,
        z: z2
      });
    }

    /* halo behind the solid */
    var halo = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.75);
    halo.addColorStop(0, rgba(PAL.node, 0.09));
    halo.addColorStop(1, rgba(PAL.node, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.75, 0, Math.PI * 2);
    ctx.fill();

    /* outer gauge rings */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = PAL.wire;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.34;
    ctx.setLineDash([2, 9]);
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.rotate(t * 0.16);
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.5;
    for (var tk = 0; tk < 6; tk++) {
      var a0 = (tk / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.42, a0, a0 + 0.1);
      ctx.stroke();
    }
    ctx.restore();

    /* edges — a soft glow pass, then a crisp pass */
    for (var pass = 0; pass < 2; pass++) {
      ctx.lineWidth = pass === 0 ? 3.4 : 1;
      for (var e = 0; e < IE.length; e++) {
        var a = pts[IE[e][0]];
        var b = pts[IE[e][1]];
        var depth = (a.z + b.z) * 0.5; /* -1 near, +1 far */
        var alpha = 0.05 + 0.82 * (1 - (depth + 1) * 0.5);
        ctx.strokeStyle = PAL.wire;
        ctx.globalAlpha = pass === 0 ? alpha * 0.14 : alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    /* vertices */
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k];
      var tw = 0.5 + 0.5 * Math.sin(t * 1.4 + k * 1.7);
      var rad = 1.15 + 0.55 * (1 - (p.z + 1) * 0.5);
      ctx.fillStyle = PAL.wire2;
      ctx.globalAlpha = 0.35 + 0.5 * tw;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- readout ---------------- */

  var coordEl = document.querySelector('.coord');
  function updateCoord(t) {
    if (!coordEl) return;
    var s = Math.floor(t);
    var mm = ('0' + Math.floor(s / 60)).slice(-2);
    var ss = ('0' + (s % 60)).slice(-2);
    coordEl.textContent = 'T+' + mm + ':' + ss + ' · NODES ' + nodes.length + ' · LINKS ' + IE.length;
  }

  /* ---------------- loop ---------------- */

  function render(t) {
    if (!bg || !core) return;
    bg.ctx.fillStyle = PAL.bg;
    bg.ctx.fillRect(0, 0, bg.w, bg.h);
    drawGrid(t);
    stepNodes();
    drawGraph(t);
    drawRipples();
    drawCore(t);
    updateCoord(t);
  }

  var start = performance.now();
  function loop(now) {
    render((now - start) / 1000);
    if (!reduce) requestAnimationFrame(loop);
  }

  /* ---------------- events ---------------- */

  function resize() {
    bg = fit(bgCv);
    core = fit(coreCv);
    buildNodes();
    if (reduce) render(0);
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
      mouse.px = e.clientX;
      mouse.py = e.clientY;
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  window.addEventListener(
    'pointerdown',
    function (e) {
      if (reduce) return;
      if (ripples.length < 8) {
        ripples.push({ x: e.clientX, y: e.clientY, rad: 2, a: 0.75 });
      }
    },
    { passive: true }
  );

  window.addEventListener('blur', function () {
    mouse.px = -9999;
    mouse.py = -9999;
    mouse.nx = 0;
    mouse.ny = 0;
  });

  /* ---------------- boot ---------------- */

  resize();
  if (reduce) {
    render(0);
  } else {
    requestAnimationFrame(loop);
  }
})();
