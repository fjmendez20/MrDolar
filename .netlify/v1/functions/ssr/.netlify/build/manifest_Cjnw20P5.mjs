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

const manifest = deserializeManifest({"hrefRoot":"file:///home/fabian/Documentos/MrDolar/","cacheDir":"file:///home/fabian/Documentos/MrDolar/node_modules/.astro/","outDir":"file:///home/fabian/Documentos/MrDolar/dist/","srcDir":"file:///home/fabian/Documentos/MrDolar/src/","publicDir":"file:///home/fabian/Documentos/MrDolar/public/","buildClientDir":"file:///home/fabian/Documentos/MrDolar/dist/","buildServerDir":"file:///home/fabian/Documentos/MrDolar/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/tasa","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/tasa\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"tasa","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/tasa.ts","pathname":"/api/tasa","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Q_Dsos97.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/fabian/Documentos/MrDolar/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/tasa@_@ts":"pages/api/tasa.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Cjnw20P5.mjs","/home/fabian/Documentos/MrDolar/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","/home/fabian/Documentos/MrDolar/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.1n9-9lwk.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/fabian/Documentos/MrDolar/src/pages/index.astro?astro&type=script&index=0&lang.ts","const B=\"/api/tasa\",y=\"mrdolar_rates\",g=\"mrdolar_rates_ts\",c=document.getElementById(\"from-amount\"),l=document.getElementById(\"to-amount\"),f=document.getElementById(\"result-text\"),E=document.getElementById(\"rate-usd\"),p=document.getElementById(\"rate-eur\"),I=document.querySelectorAll(\".tab\"),b=document.getElementById(\"from-label\"),w=document.getElementById(\"from-symbol\");let a={usd:0,eur:0},d=\"USD\",S=\"from\";function n(t){return Number(t).toLocaleString(\"es-VE\",{minimumFractionDigits:2,maximumFractionDigits:2})}function u(t,e=!1){f.textContent=t,f.style.color=e?\"var(--red)\":\"#1a7a36\"}function i(){return d===\"USD\"?a.usd:a.eur}function m(){const t=i();if(!t)return;const e=parseFloat(c.value);if(isNaN(e)||e<=0){l.value=\"\",u(\"Ingresa un valor\");return}const o=e*t;l.value=n(o),u(`${d===\"USD\"?\"$\":\"€\"} ${n(e)} = Bs ${n(o)}`)}function x(){S=\"from\",m()}function C(){const t=c.value,e=l.value.replace(/\\./g,\"\").replace(\",\",\".\");if(c.value=e?n(parseFloat(e)):\"\",l.value=t?n(parseFloat(t)):\"\",S===\"from\"){const o=i();if(o){const s=parseFloat(c.value);if(!isNaN(s)&&s>0){const r=s*o;l.value=n(r),u(`${d===\"USD\"?\"$\":\"€\"} ${n(s)} = Bs ${n(r)}`)}}}}function D(t){d=t,I.forEach(s=>s.classList.toggle(\"active\",s.dataset.currency===t));const e=t===\"USD\"?\"$\":\"€\";if(w.textContent=e,b.textContent=t===\"USD\"?\"Dólares (USD)\":\"Euros (EUR)\",i()){E.textContent=`Bs ${n(a.usd)}`,p.textContent=`Bs ${n(a.eur)}`;const s=document.getElementById(\"rate-primary\"),r=document.getElementById(\"rate-secondary\");s.style.display=\"flex\",r.style.display=\"flex\",m()}}function v(){E.textContent=a.usd?`Bs ${n(a.usd)}`:\"—\",p.textContent=a.eur?`Bs ${n(a.eur)}`:\"—\"}async function U(){try{const t=await fetch(B);if(!t.ok)throw new Error(\"Error al obtener tasas\");const e=await t.json();if(e.error)throw new Error(e.error);if(a.usd=e.usd||0,a.eur=e.eur||0,!a.usd&&!a.eur)throw new Error(\"Tasas no disponibles\");return localStorage.setItem(y,JSON.stringify(a)),localStorage.setItem(g,String(Date.now())),v(),i()&&m(),!0}catch{return!1}}function $(){const t=localStorage.getItem(y),e=localStorage.getItem(g);return t&&e&&Date.now()-Number(e)<36e5?(a=JSON.parse(t),v(),i()&&m(),!0):!1}async function h(){const t=$(),e=await U();if(!e&&!t){u(\"No se pudieron obtener las tasas\",!0);return}!e&&t&&u(\"Usando tasas guardadas\",!0)}I.forEach(t=>t.addEventListener(\"click\",()=>D(t.dataset.currency)));c.addEventListener(\"input\",x);document.getElementById(\"swap-btn\").addEventListener(\"click\",C);h();"]],"assets":["/_astro/index.Q_Dsos97.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"H8/YlyaLQHdQP47NU/DvxBxg9TX/3/AP6MHKz3sNQaM=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
