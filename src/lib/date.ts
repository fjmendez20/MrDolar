export const DAY = 86_400_000;

/** Venezuela es UTC-4 todo el año (sin horario de verano). */
const VET_OFFSET = 4 * 60 * 60 * 1000;

/** Número de día en Venezuela para un instante dado. */
export function vetDay(ms: number): number {
  return Math.floor((ms - VET_OFFSET) / DAY);
}

/** ¿Ambos instantes caen en el mismo día calendario de Venezuela? */
export function sameVetDay(a: number, b: number): boolean {
  return vetDay(a) === vetDay(b);
}
