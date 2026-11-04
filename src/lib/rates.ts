export type RateKey = "usd" | "eur" | "usdtSell" | "usdtBuy";

export type RateSource = "bcv" | "binance";

export interface RateDefinition {
  key: RateKey;
  code: string;
  tab: string;
  title: string;
  symbol: string;
  rateLabel: string;
  inputLabel: string;
  source: RateSource;
}

export type RatesPayload = Record<RateKey, number | null>;

export const RATES: RateDefinition[] = [
  {
    key: "usd",
    code: "USD",
    tab: "$ USD",
    title: "Dólares (USD)",
    symbol: "$",
    rateLabel: "Tasa USD",
    inputLabel: "Dólares (USD)",
    source: "bcv",
  },
  {
    key: "eur",
    code: "EUR",
    tab: "€ EUR",
    title: "Euros (EUR)",
    symbol: "€",
    rateLabel: "Tasa EUR",
    inputLabel: "Euros (EUR)",
    source: "bcv",
  },
  {
    key: "usdtSell",
    code: "USDT",
    tab: "USDT ↓",
    title: "Vender USDT — recibís Bs",
    symbol: "USDT",
    rateLabel: "Tasa USDT (venta)",
    inputLabel: "USDT (vender)",
    source: "binance",
  },
  {
    key: "usdtBuy",
    code: "USDT",
    tab: "USDT ↑",
    title: "Comprar USDT — pagás Bs",
    symbol: "USDT",
    rateLabel: "Tasa USDT (compra)",
    inputLabel: "USDT (comprar)",
    source: "binance",
  },
];

export const DEFAULT_RATE_KEY: RateKey = RATES[0].key;

export function findRate(key: string): RateDefinition {
  return RATES.find((r) => r.key === key) ?? RATES[0];
}

export function emptyRates(): Record<RateKey, number> {
  return Object.fromEntries(RATES.map((r) => [r.key, 0])) as Record<
    RateKey,
    number
  >;
}