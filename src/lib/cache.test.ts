import { test } from "node:test";
import assert from "node:assert/strict";
import { createCache } from "./cache.ts";

type Mode = "ok" | "fail" | "empty";

function setup(start = 1000) {
  let now = start;
  const state = { calls: 0, mode: "ok" as Mode };

  const cache = createCache<number>({
    ttl: 100,
    negativeTtl: 50,
    now: () => now,
    isEmpty: (value) => value === 0,
    fetcher: async () => {
      state.calls++;
      if (state.mode === "fail") throw new Error("boom");
      if (state.mode === "empty") return 0;
      return 42;
    },
  });

  return {
    cache,
    state,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

test("primer llamado fetch; dentro del TTL no vuelve a fetch", async () => {
  const t = setup();
  assert.equal(await t.cache(), 42);
  assert.equal(await t.cache(), 42);
  assert.equal(t.state.calls, 1);
});

test("después del TTL vuelve a fetch", async () => {
  const t = setup();
  await t.cache();
  t.advance(101);
  await t.cache();
  assert.equal(t.state.calls, 2);
});

test("llamadas concurrentes comparten un solo fetch", async () => {
  const t = setup();
  const results = await Promise.all([t.cache(), t.cache(), t.cache()]);
  assert.deepEqual(results, [42, 42, 42]);
  assert.equal(t.state.calls, 1);
});

test("resultado vacío -> null y activa negative cache", async () => {
  const t = setup();
  t.state.mode = "empty";
  assert.equal(await t.cache(), null);
  assert.equal(t.state.calls, 1);
  t.advance(10);
  assert.equal(await t.cache(), null);
  assert.equal(t.state.calls, 1);
});

test("error -> null y activa negative cache; reintenta al vencer", async () => {
  const t = setup();
  t.state.mode = "fail";
  assert.equal(await t.cache(), null);
  assert.equal(t.state.calls, 1);

  t.advance(10);
  assert.equal(await t.cache(), null);
  assert.equal(t.state.calls, 1);

  t.advance(60);
  t.state.mode = "ok";
  assert.equal(await t.cache(), 42);
  assert.equal(t.state.calls, 2);
});

function setupStale(maxStale?: number) {
  let now = 1000;
  const state = { calls: 0, mode: "ok" as Mode };

  const cache = createCache<number>({
    ttl: 100,
    negativeTtl: 50,
    maxStale,
    now: () => now,
    isEmpty: (value) => value === 0,
    fetcher: async () => {
      state.calls++;
      if (state.mode === "fail") throw new Error("boom");
      if (state.mode === "empty") return 0;
      return 42;
    },
  });

  return {
    cache,
    state,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

test("sin maxStale, error tras vencer el TTL devuelve null", async () => {
  const t = setupStale();
  assert.equal(await t.cache(), 42);
  t.advance(101);
  t.state.mode = "fail";
  assert.equal(await t.cache(), null);
});

test("maxStale sirve el último valor bueno si el fetch falla", async () => {
  const t = setupStale(1000);
  assert.equal(await t.cache(), 42);
  t.advance(101);
  t.state.mode = "fail";
  assert.equal(await t.cache(), 42);
  assert.equal(t.state.calls, 2);
});

test("maxStale también cubre un resultado vacío", async () => {
  const t = setupStale(1000);
  assert.equal(await t.cache(), 42);
  t.advance(101);
  t.state.mode = "empty";
  assert.equal(await t.cache(), 42);
});

test("maxStale deja de servir al superar la ventana", async () => {
  const t = setupStale(200);
  assert.equal(await t.cache(), 42);
  t.advance(201);
  t.state.mode = "fail";
  assert.equal(await t.cache(), null);
});

test("fresh reemplaza al ttl como criterio de frescura", async () => {
  let now = 0;
  let fresh = true;
  let calls = 0;

  const cache = createCache<number>({
    ttl: 1,
    negativeTtl: 10,
    now: () => now,
    isEmpty: () => false,
    fresh: () => fresh,
    fetcher: async () => {
      calls++;
      return 42;
    },
  });

  await cache();
  now = 1000; // muy por encima del ttl
  await cache();
  assert.equal(calls, 1);

  fresh = false;
  await cache();
  assert.equal(calls, 2);
});
