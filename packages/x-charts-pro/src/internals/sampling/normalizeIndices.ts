/**
 * Sanitizes the indices returned by a custom sampler: keeps only integers in `[0, length)`, removes
 * duplicates, and sorts them ascending. Rendering relies on sorted, unique, in-range indices, so
 * this protects the chart from a user function that returns them in any order or out of bounds.
 *
 * @param indices The indices returned by the sampler.
 * @param length The number of points in the series.
 * @returns The sanitized indices.
 */
export function normalizeIndices(indices: readonly number[], length: number): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (let k = 0; k < indices.length; k += 1) {
    const index = indices[k];
    if (Number.isInteger(index) && index >= 0 && index < length && !seen.has(index)) {
      seen.add(index);
      result.push(index);
    }
  }
  result.sort((a, b) => a - b);
  return result;
}
