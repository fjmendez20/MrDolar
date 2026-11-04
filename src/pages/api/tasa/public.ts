import type { APIRoute } from "astro";
import { getBcvRates, getP2PRates } from "../../../lib/rates-server";
import { RATES, type RatesPayload } from "../../../lib/rates";

export const GET: APIRoute = async () => {
  try {
    const [bcv, p2p] = await Promise.all([getBcvRates(), getP2PRates()]);

    const rates: RatesPayload = {
      usd: bcv?.usd ?? null,
      eur: bcv?.eur ?? null,
      usdtBuy: p2p?.usdtBuy ?? null,
      usdtSell: p2p?.usdtSell ?? null,
    };

    const hayAlguna = RATES.some((r) => rates[r.key]);

    if (!hayAlguna) {
      return new Response(
        JSON.stringify({ error: "No se encontraron tasas en la página" }),
        { status: 502 }
      );
    }

    return new Response(JSON.stringify(rates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al obtener la tasa";
    return new Response(JSON.stringify({ error: msg }), { status: 502 });
  }
};