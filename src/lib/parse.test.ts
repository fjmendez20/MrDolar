import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePasteValue } from "./parse.ts";

test("acepta texto con barra Bs/USDT", () => {
  assert.equal(parsePasteValue("952,00 Bs/USDT"), 952);
});

test("formato es-VE: 1.234,56 -> 1234.56", () => {
  assert.equal(parsePasteValue("1.234,56"), 1234.56);
});

test("formato en-US: 1,234.56 -> 1234.56", () => {
  assert.equal(parsePasteValue("1,234.56"), 1234.56);
});

test("ignora símbolo de moneda y espacios", () => {
  assert.equal(parsePasteValue("$ 10,50"), 10.5);
});

test("ignora el sufijo USDT", () => {
  assert.equal(parsePasteValue("100 USDT"), 100);
});

test("vacío o sin números -> null", () => {
  assert.equal(parsePasteValue(""), null);
  assert.equal(parsePasteValue("abc"), null);
  assert.equal(parsePasteValue("Bs/USDT"), null);
});
