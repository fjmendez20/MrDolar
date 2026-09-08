import type { APIRoute } from "astro";
import { getRates } from "../../../lib/bcv";

export const GET: APIRoute = async () => {
  try {
    const { usd, eur } = await getRates();

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