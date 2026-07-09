import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import 'piccolore';
import { k as NOOP_MIDDLEWARE_HEADER, l as decodeKey } from './chunks/astro/server_Cxim8Tk5.mjs';
import 'clsx';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/fabian/Documentos/MrDolar/","cacheDir":"file:///home/fabian/Documentos/MrDolar/node_modules/.astro/","outDir":"file:///home/fabian/Documentos/MrDolar/dist/","srcDir":"file:///home/fabian/Documentos/MrDolar/src/","publicDir":"file:///home/fabian/Documentos/MrDolar/public/","buildClientDir":"file:///home/fabian/Documentos/MrDolar/dist/","buildServerDir":"file:///home/fabian/Documentos/MrDolar/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/tasa","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/tasa\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"tasa","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/tasa.ts","pathname":"/api/tasa","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Q_Dsos97.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/fabian/Documentos/MrDolar/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/tasa@_@ts":"pages/api/tasa.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DklDT5jp.mjs","/home/fabian/Documentos/MrDolar/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","/home/fabian/Documentos/MrDolar/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.C0-wp5dk.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/fabian/Documentos/MrDolar/src/pages/index.astro?astro&type=script&index=0&lang.ts","const B=\"/api/tasa\",g=\"mrdolar_rates\",E=\"mrdolar_rates_ts\",u=document.getElementById(\"from-amount\"),c=document.getElementById(\"to-amount\"),y=document.getElementById(\"result-text\"),v=document.getElementById(\"rate-usd\"),I=document.getElementById(\"rate-eur\"),p=document.querySelectorAll(\".tab\"),w=document.getElementById(\"from-label\"),x=document.getElementById(\"from-symbol\");let n={usd:0,eur:0},d=\"USD\",i=\"from\";function a(t){return Number(t).toLocaleString(\"es-VE\",{minimumFractionDigits:2,maximumFractionDigits:2})}function r(t,e=!1){y.textContent=t,y.style.color=e?\"var(--red)\":\"#1a7a36\"}function m(){return d===\"USD\"?n.usd:n.eur}function l(){const t=m();if(t)if(i===\"from\"){const e=parseFloat(u.value);if(isNaN(e)||e<=0){c.value=\"\",r(\"Ingresa un valor\");return}const s=e*t;c.value=a(s),r(`${d===\"USD\"?\"$\":\"€\"} ${a(e)} = Bs ${a(s)}`)}else{const e=parseFloat(c.value);if(isNaN(e)||e<=0){u.value=\"\",r(\"Ingresa un valor\");return}const s=e/t;u.value=a(s);const o=d===\"USD\"?\"$\":\"€\";r(`Bs ${a(e)} = ${o} ${a(s)}`)}}function b(){i=\"from\",l()}function C(){i=\"to\",l()}function D(){const t=u.value,e=c.value;u.value=e,c.value=t,i=i===\"from\"?\"to\":\"from\",l()}function U(t){d=t,p.forEach(o=>o.classList.toggle(\"active\",o.dataset.currency===t));const e=t===\"USD\"?\"$\":\"€\";if(x.textContent=e,w.textContent=t===\"USD\"?\"Dólares (USD)\":\"Euros (EUR)\",m()){v.textContent=`Bs ${a(n.usd)}`,I.textContent=`Bs ${a(n.eur)}`;const o=document.getElementById(\"rate-primary\"),f=document.getElementById(\"rate-secondary\");o.style.display=\"flex\",f.style.display=\"flex\",l()}}function S(){v.textContent=n.usd?`Bs ${a(n.usd)}`:\"—\",I.textContent=n.eur?`Bs ${a(n.eur)}`:\"—\"}async function $(){try{const t=await fetch(B);if(!t.ok)throw new Error(\"Error al obtener tasas\");const e=await t.json();if(e.error)throw new Error(e.error);if(n.usd=e.usd||0,n.eur=e.eur||0,!n.usd&&!n.eur)throw new Error(\"Tasas no disponibles\");return localStorage.setItem(g,JSON.stringify(n)),localStorage.setItem(E,String(Date.now())),S(),m()&&l(),!0}catch{return!1}}function h(){const t=localStorage.getItem(g),e=localStorage.getItem(E);return t&&e&&Date.now()-Number(e)<36e5?(n=JSON.parse(t),S(),m()&&l(),!0):!1}async function N(){const t=h(),e=await $();if(!e&&!t){r(\"No se pudieron obtener las tasas\",!0);return}!e&&t&&r(\"Usando tasas guardadas\",!0)}p.forEach(t=>t.addEventListener(\"click\",()=>U(t.dataset.currency)));u.addEventListener(\"input\",b);c.addEventListener(\"input\",C);document.getElementById(\"swap-btn\").addEventListener(\"click\",D);N();"]],"assets":["/_astro/index.Q_Dsos97.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"W3cbUNRBck4Vr9KxZzxt4TxHCc9aznq88+uT8+tsvuU=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
