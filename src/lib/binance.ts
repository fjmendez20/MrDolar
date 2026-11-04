import https from "node:https";

const HOST = "p2p.binance.com";
const PATH = "/bapi/c2c/v2/friendly/c2c/adv/search";
const MAX_ROWS = 20;
const TIMEOUT_MS = 15000;

export interface P2PAdvRow {
  adv?: { price?: string | number; tradeType?: string };
}

export interface P2PResponse {
  success?: boolean;
  data?: P2PAdvRow[] | null;
}

/**
 * Promedio de los precios de los avisos de una respuesta P2P.
 * Función pura: sin red, para poder testear el parseo por separado.
 *
 * `adv.price` viene como string con punto decimal y 3 decimales
 * (priceScale 3, ej. "952.000"). No usar aquí el normalizador de bcv.ts,
 * que asume coma decimal.
 */
export function parseP2PAverage(
  json: P2PResponse | null | undefined
): number | null {
  if (!json?.success || !Array.isArray(json.data) || json.data.length === 0) {
    return null;
  }

  const prices = json.data
    .map((row) => Number(row?.adv?.price))
    .filter((p) => Number.isFinite(p) && p > 0);

  if (prices.length === 0) return null;
  return prices.reduce((sum, p) => sum + p, 0) / prices.length;
}

function postP2P(body: Record<string, unknown>): Promise<P2PResponse> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        host: HOST,
        path: PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw) as P2PResponse);
          } catch {
            reject(new Error("Respuesta JSON inválida de Binance P2P"));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    req.write(payload);
    req.end();
  });
}

/**
 * El endpoint no tiene un par USDTVES en spot: el precio contra bolívares solo
 * existe en el mercado P2P, y ahí `tradeType` va desde la perspectiva del usuario.
 *
 * tradeType "BUY"  -> devuelve avisos `adv.tradeType === "SELL"`: otro te VENDE USDT,
 *                     así que ese precio es lo que PAGAS al comprar (más caro).
 * tradeType "SELL" -> devuelve avisos `adv.tradeType === "BUY"`: otro te COMPRA USDT,
 *                     así que ese precio es lo que RECIBES al vender (más barato).
 */
async function averageUsdtPrice(tradeType: "BUY" | "SELL"): Promise<number | null> {
  const res = await postP2P({
    page: 1,
    rows: MAX_ROWS,
    payTypes: [],
    asset: "USDT",
    tradeType,
    fiat: "VES",
    countries: ["VE"],
  });

  return parseP2PAverage(res);
}

export async function fetchUsdtVes(): Promise<{
  usdtBuy: number | null;
  usdtSell: number | null;
}> {
  const [buy, sell] = await Promise.all([
    averageUsdtPrice("BUY").catch(() => null),
    averageUsdtPrice("SELL").catch(() => null),
  ]);
  return { usdtBuy: buy, usdtSell: sell };
}