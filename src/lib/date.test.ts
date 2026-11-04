import { test } from "node:test";
import assert from "node:assert/strict";
import { vetDay, sameVetDay } from "./date.ts";

test("la medianoche VET (04:00 UTC) separa dos días", () => {
  const lastOfDay = Date.parse("2026-01-01T03:59:59Z"); // 31/12 23:59 VET
  const firstOfNext = Date.parse("2026-01-01T04:00:00Z"); // 01/01 00:00 VET
  assert.notEqual(vetDay(lastOfDay), vetDay(firstOfNext));
  assert.equal(vetDay(firstOfNext) - vetDay(lastOfDay), 1);
});

test("mismo día VET a horas distintas", () => {
  const a = Date.parse("2026-03-10T05:00:00Z"); // 10/03 01:00 VET
  const b = Date.parse("2026-03-11T03:00:00Z"); // 10/03 23:00 VET
  assert.ok(sameVetDay(a, b));
});

test("no depende de la zona horaria del proceso", () => {
  const noonUtc = Date.parse("2026-06-15T12:00:00Z");
  assert.equal(sameVetDay(noonUtc, noonUtc), true);
});

test("instantes separados por más de un día VET difieren", () => {
  const a = Date.parse("2026-06-15T12:00:00Z");
  const b = Date.parse("2026-06-16T12:00:00Z");
  assert.equal(sameVetDay(a, b), false);
});
