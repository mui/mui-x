export function findMinMax(data: readonly number[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;

  for (const value of data ?? []) {
    if (value < min) {
      min = value;
    }

    if (value > max) {
      max = value;
    }
  }

  return [min, max];
}
