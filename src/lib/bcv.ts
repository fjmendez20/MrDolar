import https from "node:https";

export function fetchBCV(): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      "https://www.bcv.org.ve/",
      {
        // NO QUITAR sin probar contra https://www.bcv.org.ve/ real.
        // El BCV envía solo su cert leaf (*.bcv.org.ve), no la cadena
        // intermedia (emisor: "Sectigo Public Server Authentication CA DV
        // R36"). Windows resuelve el intermedio vía AIA; Node no, y falla con
        // UNABLE_TO_VERIFY_LEAF_SIGNATURE. Sin este flag, getRates() devuelve
        // {usd: null, eur: null} silenciosamente.
        agent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 15000,
      },
      (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

export function extractTasa(html: string, currency: string): number | null {
  const blockRe =
    /<div[^>]*recuadrotsmc[^>]*>[\s\S]*?<\/div>\s*<\/div>(?:\s*<\/div>)?/gs;
  // El código aparece como `<span> EUR </span>` (con espacios). Antes se usaba
  // `includes(currency)`, que es un match por substring y podría dar falsos
  // positivos; ahora exigimos el span completo.
  const codeRe = new RegExp(`<span[^>]*>\\s*${currency}\\s*</span>`);
  const blocks = html.matchAll(blockRe);

  for (const block of blocks) {
    if (codeRe.test(block[0])) {
      const tbRe =
        /<strong[^>]*class="strong-tb"[^>]*>\s*([\d.,]+)\s*<\/strong>/s;
      const tb = block[0].match(tbRe);
      if (!tb) continue;
      const raw = tb[1].trim();
      const normalized = raw.replace(/\./g, "").replace(",", ".");
      const tasa = parseFloat(normalized);
      return isNaN(tasa) || tasa <= 0 ? null : tasa;
    }
  }
  return null;
}

export async function getRates(): Promise<{ usd: number | null; eur: number | null }> {
  const html = await fetchBCV();
  const usd = extractTasa(html, "USD");
  const eur = extractTasa(html, "EUR");
  return { usd, eur };
}