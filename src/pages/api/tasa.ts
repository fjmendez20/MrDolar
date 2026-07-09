import type { APIRoute } from "astro";
import https from "node:https";

function fetchBCV(): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      "https://www.bcv.org.ve/",
      {
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

function extractTasa(html: string, currency: string): number | null {
  const escaped = currency.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const blockRe =
    /<div[^>]*recuadrotsmc[^>]*>[\s\S]*?<\/div>\s*<\/div>(?:\s*<\/div>)?/gs;
  const blocks = html.matchAll(blockRe);

  for (const block of blocks) {
    if (block[0].includes(currency)) {
      const tbRe =
        /<strong[^>]*class="strong-tb"[^>]*>\s*([\d.,]+)\s*<\/strong>/s;
      const tb = block[0].match(tbRe);
      if (!tb) return null;
      const raw = tb[1].trim();
      const normalized = raw.replace(/\./g, "").replace(",", ".");
      const tasa = parseFloat(normalized);
      return isNaN(tasa) || tasa <= 0 ? null : tasa;
    }
  }
  return null;
}

export const GET: APIRoute = async () => {
  try {
    const html = await fetchBCV();
    const usd = extractTasa(html, "USD");
    const eur = extractTasa(html, "EUR");

    if (!usd && !eur) {
      return new Response(
        JSON.stringify({ error: "No se encontraron tasas en la página" }),
        { status: 502 }
      );
    }

    return new Response(JSON.stringify({ usd, eur }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al obtener la tasa";
    return new Response(JSON.stringify({ error: msg }), { status: 502 });
  }
};
