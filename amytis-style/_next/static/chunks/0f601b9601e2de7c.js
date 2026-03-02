(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,59550,e=>{"use strict";var t=e.i(167),i=e.i(93046),r=(0,i.__name)((e,r,l,o)=>{e.attr("class",l);let{width:n,height:c,x:d,y:g}=s(e,r);(0,t.configureSvgSize)(e,c,n,o);let u=a(d,g,n,c,r);e.attr("viewBox",u),i.log.debug(`viewBox configured: ${u} with padding: ${r}`)},"setupViewPortForSVG"),s=(0,i.__name)((e,t)=>{let i=e.node()?.getBBox()||{width:0,height:0,x:0,y:0};return{width:i.width+2*t,height:i.height+2*t,x:i.x,y:i.y}},"calculateDimensionsWithPadding"),a=(0,i.__name)((e,t,i,r,s)=>`${e-s} ${t-s} ${i} ${r}`,"createViewBox");e.s(["setupViewPortForSVG",()=>r])},89670,e=>{"use strict";var t=e.i(93046);e.i(22246);var i=e.i(64142),r=(0,t.__name)((e,t)=>{let r;return"sandbox"===t&&(r=(0,i.select)("#i"+e)),("sandbox"===t?(0,i.select)(r.nodes()[0].contentDocument.body):(0,i.select)("body")).select(`[id="${e}"]`)},"getDiagramElement");e.s(["getDiagramElement",()=>r])},43843,e=>{"use strict";var t=(0,e.i(93046).__name)(()=>`
  /* Font Awesome icon styling - consolidated */
  .label-icon {
    display: inline-block;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
  }
  
  .node .label-icon path {
    fill: currentColor;
    stroke: revert;
    stroke-width: revert;
  }
`,"getIconStyles");e.s(["getIconStyles",()=>t])},80077,e=>{"use strict";var t=e.i(83759);e.i(43843),e.i(89670),e.i(59550),e.i(84052),e.i(25315),e.i(58089),e.i(1298),e.i(1974),e.i(73753),e.i(2039),e.i(4194),e.i(167);var i=e.i(93046),r={parser:t.classDiagram_default,get db(){return new t.ClassDB},renderer:t.classRenderer_v3_unified_default,styles:t.styles_default,init:(0,i.__name)(e=>{e.class||(e.class={}),e.class.arrowMarkerAbsolute=e.arrowMarkerAbsolute},"init")};e.s(["diagram",()=>r])}]);