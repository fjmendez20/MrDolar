import { c as createComponent, i as renderHead, j as renderScript, r as renderTemplate } from '../chunks/astro/server_Cxim8Tk5.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MrDolar — Conversor BCV</title><meta name="description" content="Conversor de dólares y euros a bolívares según tasa BCV"><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body> <main> <div class="card"> <h1>MrDolar</h1> <p class="subtitle">Conversor BCV</p> <div class="tabs" role="tablist"> <button class="tab active" data-currency="USD" role="tab">$ USD</button> <button class="tab" data-currency="EUR" role="tab">€ EUR</button> </div> <div class="rate-bar" id="rate-primary"> <span class="rate-label">Tasa USD</span> <span> <span class="rate-value" id="rate-usd">—</span> <span class="rate-badge">BCV</span> </span> </div> <div class="rate-bar secondary" id="rate-secondary"> <span class="rate-label">Tasa EUR</span> <span class="rate-value" id="rate-eur">—</span> </div> <div class="form-group"> <label for="from-amount" id="from-label">Dólares (USD)</label> <div class="input-wrapper"> <span class="currency-prefix" id="from-symbol">$</span> <input type="number" id="from-amount" placeholder="0.00" step="any" min="0"> </div> </div> <button class="swap-btn" id="swap-btn" aria-label="Invertir">⇅</button> <div class="form-group"> <label for="to-amount">Bolívares (Bs)</label> <div class="input-wrapper"> <span class="currency-prefix">Bs</span> <input type="number" id="to-amount" placeholder="0.00" step="any" min="0"> </div> </div> <div class="result-box" id="result"> <span id="result-text">Ingresa un valor</span> </div> </div> </main> ${renderScript($$result, "/home/fabian/Documentos/MrDolar/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/fabian/Documentos/MrDolar/src/pages/index.astro", void 0);

const $$file = "/home/fabian/Documentos/MrDolar/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
