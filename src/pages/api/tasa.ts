import type { APIRoute } from "astro";
import { getRates } from "../../lib/bcv";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function verifyAuth(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  if (!auth) return false;

  const token = auth.replace(/^Bearer\s+/i, "").trim();
  const expected = import.meta.env.TASA_API_KEY;

  if (!expected) {
    console.error("TASA_API_KEY no está definida en variables de entorno");
    return false;
  }

  return token.length > 0 && token === expected;
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const GET: APIRoute = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(
      JSON.stringify({ error: "API key inválida o no proporcionada" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { usd, eur } = await getRates();

    if (!usd && !eur) {
      return new Response(
        JSON.stringify({ error: "No se encontraron tasas en la página" }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ usd, eur }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al obtener la tasa";
    return new Response(JSON.stringify({ error: msg }), { status: 502, headers: corsHeaders });
  }
};