export function roundToDecimalPlaces(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
