/**
 * M4 downsampling.
 *
 * Splits the data into `columns` index buckets and, for each bucket, keeps the first, last,
 * minimum, and maximum points. Preserving the min and max keeps each bucket's full vertical extent,
 * so the line keeps its peaks and troughs at up to four points per column.
 *
 * The M4 paper bills this as pixel-perfect when each bucket maps to exactly one rendered pixel
 * column and the x values are evenly spaced. Here the buckets are sized by index rather than by
 * x-pixel, so it is a close, shape-preserving approximation rather than a strict guarantee — but it
 * is the densest, most faithful of the built-in line methods.
 *
 * Reference: Jugel et al., "M4: A Visualization-Oriented Time Series Data Aggregation" (2014).
 *
 * @param values The value of each point.
 * @param columns The number of buckets to split the data into.
 * @returns The sorted indices to keep (first, last, min, and max per column).
 */
export function m4(values: readonly number[], columns: number): number[] {
  const length = values.length;

  if (columns < 1 || columns * 4 >= length) {
    return Array.from({ length }, (_, i) => i);
  }

  const bucketSize = length / columns;
  const kept = new Set<number>();

  for (let column = 0; column < columns; column += 1) {
    const start = Math.floor(column * bucketSize);
    const end = Math.min(length, Math.floor((column + 1) * bucketSize));
    if (start >= end) {
      continue;
    }
    let minIndex = start;
    let maxIndex = start;
    for (let j = start; j < end; j += 1) {
      if (values[j] < values[minIndex]) {
        minIndex = j;
      }
      if (values[j] > values[maxIndex]) {
        maxIndex = j;
      }
    }
    // First and last preserve the column's entry/exit; min and max preserve its vertical extent.
    kept.add(start);
    kept.add(end - 1);
    kept.add(minIndex);
    kept.add(maxIndex);
  }

  return Array.from(kept).sort((a, b) => a - b);
}
