/**
 * Normaliza un monto pegado desde el portapapeles. Soporta formatos es-VE
 * ("1.234,56"), en-US ("1,234.56") y textos como "952,00 Bs/USDT".
 * Devuelve `null` si no hay un número válido.
 */
export function parsePasteValue(text: string): number | null {
  let t = text
    .trim()
    .replace(/[$€£₮]/g, "")
    .replace(/usdt/gi, "")
    .replace(/bs\.?\s*/gi, "")
    .replace(/\//g, "")
    .replace(/\s/g, "");
  if (!t || !/^[\d.,]+$/.test(t)) return null;

  const dots = (t.match(/\./g) || []).length;
  const commas = (t.match(/,/g) || []).length;

  if (dots && commas) {
    t =
      t.lastIndexOf(".") > t.lastIndexOf(",")
        ? t.replace(/,/g, "")
        : t.replace(/\./g, "").replace(",", ".");
  } else if (commas) {
    t = t.replace(/,/g, ".");
  } else if (dots > 1) {
    t = t.replace(/\./g, "");
  }

  const num = parseFloat(t);
  return isNaN(num) ? null : num;
}
