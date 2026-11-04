export interface CacheConfig<T> {
  /** Cuánto se considera fresco un valor exitoso (ignorado si hay `fresh`). */
  ttl: number;
  /** Cuánto se suprime un reintento tras un fallo o resultado vacío. */
  negativeTtl: number;
  fetcher: () => Promise<T>;
  /** Un resultado vacío (ej. todas las tasas en null) no se cachea como bueno. */
  isEmpty: (value: T) => boolean;
  /** Reloj inyectable para tests. */
  now?: () => number;
  /**
   * Criterio de frescura alternativo a `ttl`. Se usa, por ejemplo, para cachear
   * la tasa del BCV hasta la medianoche de Venezuela en vez de por tiempo fijo.
   */
  fresh?: (at: number, now: number) => boolean;
  /**
   * Si se define, un fallo (o resultado vacío) sirve el último valor bueno
   * mientras su antigüedad sea menor a esta ventana. Si no, devuelve `null`.
   */
  maxStale?: number;
}

/**
 * Cache de una sola entrada con TTL, dedupe de llamadas concurrentes y
 * negative caching. Devuelve `null` cuando no hay dato disponible.
 *
 * Por defecto no sirve valores vencidos (sin stale-on-error); con `maxStale`
 * se habilita el fallback al último valor bueno cuando el fetch falla.
 *
 * Módulo puro: sin imports de Node, para poder testearlo con `node --test`
 * (que exige extensiones explícitas en imports relativos). El wiring con los
 * scrapers vive en `rates-server.ts`.
 */
export function createCache<T>(config: CacheConfig<T>): () => Promise<T | null> {
  const now = config.now ?? Date.now;
  let entry: { value: T; at: number } | null = null;
  let failedAt = 0;
  let inflight: Promise<T | null> | null = null;

  function stale(t: number): T | null {
    if (!entry) return null;
    if (config.maxStale === undefined) return null;
    return t - entry.at < config.maxStale ? entry.value : null;
  }

  return function get(): Promise<T | null> {
    const t = now();

    const isFresh =
      entry !== null &&
      (config.fresh ? config.fresh(entry.at, t) : t - entry.at < config.ttl);
    if (isFresh) {
      return Promise.resolve(entry!.value);
    }

    if (failedAt > 0 && t - failedAt < config.negativeTtl) {
      return Promise.resolve(stale(t));
    }

    if (inflight) return inflight;

    inflight = config
      .fetcher()
      .then((value) => {
        const doneAt = now();
        if (config.isEmpty(value)) {
          failedAt = doneAt;
          return stale(doneAt);
        }
        entry = { value, at: doneAt };
        failedAt = 0;
        return value;
      })
      .catch(() => {
        const doneAt = now();
        failedAt = doneAt;
        return stale(doneAt);
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  };
}
