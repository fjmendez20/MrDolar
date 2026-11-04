import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractTasa } from "./bcv.ts";

const fixture = readFileSync(
  new URL("./__fixtures__/bcv.html", import.meta.url),
  "utf8"
);

function block(code: string, value?: string): string {
  const strong =
    value === undefined ? "" : `<strong class="strong-tb"> ${value}</strong>`;
  return `<div class="row recuadrotsmc"><div><span> ${code} </span>${strong}</div></div>`;
}

test("extrae USD del snapshot real del BCV", () => {
  assert.equal(extractTasa(fixture, "USD"), 859.0629);
});

test("extrae EUR del snapshot real del BCV", () => {
  assert.equal(extractTasa(fixture, "EUR"), 973.30967507);
});

test("es genérico: extrae monedas que la app no expone", () => {
  assert.equal(extractTasa(fixture, "CNY"), 128.17051846);
  assert.equal(extractTasa(fixture, "TRY"), 17.53314828);
  assert.equal(extractTasa(fixture, "RUB"), 10.22815692);
});

test("devuelve null si la moneda no está", () => {
  assert.equal(extractTasa(fixture, "GBP"), null);
});

test("página de mantenimiento del BCV (sin bloques) devuelve null", () => {
  const maintenance =
    "<html><body><img src='imagen_pag_mant.jpeg'></body></html>";
  assert.equal(extractTasa(maintenance, "USD"), null);
});

test("bloque malformado sin strong-tb NO aborta el escaneo (regresión)", () => {
  const html = block("USD") + block("USD", "500,00");
  assert.equal(extractTasa(html, "USD"), 500);
});

test("normaliza formato es-VE: 1.234,56 -> 1234.56", () => {
  assert.equal(extractTasa(block("USD", "1.234,56"), "USD"), 1234.56);
});

test("rechaza cero y basura", () => {
  assert.equal(extractTasa(block("USD", "0,00"), "USD"), null);
  assert.equal(extractTasa(block("USD", ".-"), "USD"), null);
});

test("no confunde códigos por substring (USD vs USDT)", () => {
  // Con el viejo includes("USD"), un bloque USDT daba falso positivo.
  assert.equal(extractTasa(block("USDT", "999,00"), "USD"), null);
});
