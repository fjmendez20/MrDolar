import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseP2PAverage, type P2PResponse } from "./binance.ts";

const buy = JSON.parse(
  readFileSync(new URL("./__fixtures__/p2p-buy.json", import.meta.url), "utf8")
) as P2PResponse;
const sell = JSON.parse(
  readFileSync(new URL("./__fixtures__/p2p-sell.json", import.meta.url), "utf8")
) as P2PResponse;

function avg(prices: (string | number)[]): P2PResponse {
  return { success: true, data: prices.map((price) => ({ adv: { price } })) };
}

function realAverage(res: P2PResponse): number {
  const prices = (res.data ?? []).map((r) => Number(r.adv?.price));
  return prices.reduce((s, p) => s + p, 0) / prices.length;
}

test("promedia el fixture real de compra", () => {
  assert.ok(Math.abs(parseP2PAverage(buy)! - realAverage(buy)) < 1e-9);
});

test("promedia el fixture real de venta", () => {
  assert.ok(Math.abs(parseP2PAverage(sell)! - realAverage(sell)) < 1e-9);
});

test("data null -> null", () => {
  assert.equal(parseP2PAverage({ success: true, data: null }), null);
});

test("success false -> null", () => {
  assert.equal(
    parseP2PAverage({ success: false, data: [{ adv: { price: "100" } }] }),
    null
  );
});

test("array vacío -> null", () => {
  assert.equal(parseP2PAverage({ success: true, data: [] }), null);
});

test("null/undefined -> null", () => {
  assert.equal(parseP2PAverage(null), null);
  assert.equal(parseP2PAverage(undefined), null);
});

test("filtra no numéricos, cero y negativos", () => {
  assert.equal(parseP2PAverage(avg(["100", "abc", "0", "-5", 200])), 150);
});

test("un solo ad", () => {
  assert.equal(parseP2PAverage(avg(["952.123"])), 952.123);
});

test("todos inválidos -> null", () => {
  assert.equal(parseP2PAverage(avg(["abc", "0", "-1"])), null);
});

test("interpreta el punto como decimal, no como miles (priceScale 3)", () => {
  assert.equal(parseP2PAverage(avg(["1010.500"])), 1010.5);
});
