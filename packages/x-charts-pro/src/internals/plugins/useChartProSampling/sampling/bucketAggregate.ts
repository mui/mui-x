/**
 * Bucket-aggregation downsampling for bar series.
 *
 * Bars narrower than a pixel are invisible, so consecutive categories are grouped into `target`
 * buckets and a single representative bar — the one with the largest absolute value — is rendered
 * per bucket. This bounds the number of drawn bars while keeping the most prominent ones.
 *
 * @param values The value of each bar (`null` is treated as 0 for comparison).
 * @param target The desired number of bars.
 * @returns The sorted original indices to keep.
 */
export function bucketAggregate(values: ReadonlyArray<number | null>, target: number): number[] {
  const length = values.length;

  if (target >= length || target < 1) {
    return Array.from({ length }, (_, i) => i);
  }

  const bucketSize = length / target;
  const indices: number[] = [];

  for (let b = 0; b < target; b += 1) {
    const start = Math.floor(b * bucketSize);
    const end = Math.min(length, Math.floor((b + 1) * bucketSize));
    if (start >= end) {
      continue;
    }
    let representative = start;
    let maxAbs = -1;
    for (let j = start; j < end; j += 1) {
      const abs = Math.abs(values[j] ?? 0);
      if (abs > maxAbs) {
        maxAbs = abs;
        representative = j;
      }
    }
    indices.push(representative);
  }

  return indices;
}
