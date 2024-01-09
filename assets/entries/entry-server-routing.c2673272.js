function asyncGeneratorStep(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(a){return void c(a)}h.done?b(i):Promise.resolve(i).then(d,e)}function _asyncToGenerator(a){return function(){var b=this,c=arguments;return new Promise(function(d,e){function f(a){asyncGeneratorStep(h,d,e,f,g,"next",a)}function g(a){asyncGeneratorStep(h,d,e,f,g,"throw",a)}var h=a.apply(b,c);f(void 0)})}}function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b=_toPropertyKey(b),b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _toPropertyKey(a){var b=_toPrimitive(a,"string");return"symbol"==typeof b?b:b+""}function _toPrimitive(a,b){if("object"!=typeof a||null===a)return a;var c=a[Symbol.toPrimitive];if(c!==void 0){var d=c.call(a,b||"default");if("object"!=typeof d)return d;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===b?String:Number)(a)}import{_ as o,s as p,e as d,v as u,o as s,j as c,B as _,w as f,h as v,M as y,N as h,K as E,J as m}from"../chunks/chunk-2b1d4002.js";var r={},F={},x={},C={},b=[],R={},w=!0,L=[],P={onBeforeRoute:null},O=Object.assign({"/pages/icon.page.tsx":()=>o(()=>import("./pages_icon.page.fc81f2f1.js"),["assets/entries/pages_icon.page.fc81f2f1.js","assets/chunks/chunk-c99e57a5.js","assets/chunks/chunk-9462a3a4.js","assets/static/index.e0105b12.css","assets/static/icon.page.e78f4f6e.css"]),"/pages/index.page.tsx":()=>o(()=>import("./pages_index.page.541b3e46.js"),["assets/entries/pages_index.page.541b3e46.js","assets/chunks/chunk-c99e57a5.js","assets/chunks/chunk-6c2270a1.js","assets/chunks/chunk-8af89c92.js","assets/chunks/chunk-9462a3a4.js","assets/static/index.e0105b12.css","assets/static/index.page.64ccd428.css"])}),z=_objectSpread({},O);r[".page"]=z;var A=Object.assign({"/pages/webmanifest.json.page.client.ts":()=>o(()=>import("./pages_webmanifest.json.page.client.90d8d3f6.js"),["assets/entries/pages_webmanifest.json.page.client.90d8d3f6.js","assets/chunks/chunk-8af89c92.js"]),"/renderer/_default.page.client.tsx":()=>o(()=>import("./renderer_default.page.client.4719a7ab.js"),["assets/entries/renderer_default.page.client.4719a7ab.js","assets/chunks/chunk-c99e57a5.js","assets/chunks/chunk-6c2270a1.js"])}),H=_objectSpread({},A);r[".page.client"]=H;var I=Object.freeze(Object.defineProperty({__proto__:null,isGeneratedFile:!0,neverLoaded:R,pageConfigGlobal:P,pageConfigs:L,pageFilesEager:F,pageFilesExportNamesEager:C,pageFilesExportNamesLazy:x,pageFilesLazy:r,pageFilesList:b},Symbol.toStringTag,{value:"Module"}));p(I);var g=d({withoutHash:!0});function S(){return _S.apply(this,arguments)}function _S(){return _S=_asyncToGenerator(function*(){var a=u();return s(a,{isHydration:!0,isBackwardNavigation:null}),s(a,yield B(a._pageId)),j(),a}),_S.apply(this,arguments)}function j(){var a=d({withoutHash:!0});c(g===a,"URL manipulated before hydration finished (`".concat(g,"` to `").concat(a,"`). Ensure the hydration finishes with `onHydrationEnd()` before manipulating the URL."))}function B(){return _B.apply(this,arguments)}function _B(){return _B=_asyncToGenerator(function*(b){var c={},{pageFilesAll:a,pageConfigs:d}=yield _(!0);return s(c,{_pageFilesAll:a,_pageConfigs:d}),s(c,yield f(a,d,b)),a.filter(a=>".page.server"!==a.fileType).forEach(a=>{var b;v(null===(b=a.fileExports)||void 0===b||!b.onBeforeRender,"`export { onBeforeRender }` of ".concat(a.filePath," is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define `onBeforeRender()` in `.page.server.js` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing"),{onlyOnce:!0})}),c}),_B.apply(this,arguments)}y(),h(!0),T();function T(){return _T.apply(this,arguments)}function _T(){return _T=_asyncToGenerator(function*(){var b,c,d=yield S();yield E(d,!1),m(d,"onHydrationEnd"),yield null===(c=(b=d.exports).onHydrationEnd)||void 0===c?void 0:c.call(b,d)}),_T.apply(this,arguments)}