import { getRates } from "./bcv";
import { fetchUsdtVes } from "./binance";
import { createCache } from "./cache";
import { DAY, sameVetDay } from "./date";

const MINUTE = 60_000;
const WEEK = 7 * DAY;

/**
 * El BCV publica ~1 vez al día, así que la tasa se considera fresca hasta la
 * medianoche de Venezuela. Si la página falla o sirve la imagen de
 * mantenimiento (`isEmpty`), se sigue usando la última tasa buena por hasta una
 * semana.
 */
export const getBcvRates = createCache({
  ttl: DAY,
  fresh: sameVetDay,
  maxStale: WEEK,
  negativeTtl: 2 * MINUTE,
  fetcher: getRates,
  isEmpty: (rates) => !rates.usd && !rates.eur,
});

/** El P2P se mueve todo el día: TTL corto y sin stale. */
export const getP2PRates = createCache({
  ttl: 5 * MINUTE,
  negativeTtl: MINUTE,
  fetcher: fetchUsdtVes,
  isEmpty: (rates) => !rates.usdtBuy && !rates.usdtSell,
});
