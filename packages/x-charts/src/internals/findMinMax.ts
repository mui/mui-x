/**
 * Efficiently finds the minimum and maximum values in an array of numbers.
 * This functions helps preventing maximum call stack errors when dealing with large datasets.
 *
 * @param data The array of numbers to evaluate
 * @returns [min, max] as numbers
 */
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
