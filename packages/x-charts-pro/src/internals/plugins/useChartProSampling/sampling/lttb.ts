/**
 * Largest-Triangle-Three-Buckets downsampling.
 *
 * Splits the data into `target` buckets and, for each bucket, keeps the point that forms the
 * largest triangle with the previously-kept point and the average of the next bucket. This
 * preserves peaks, troughs, and the overall visual shape of a line far better than naive stride
 * sampling. The first and last points are always kept.
 *
 * Reference: Sveinn Steinarsson, "Downsampling Time Series for Visual Representation" (2013).
 *
 * @param x The x position of each point (typically in pixels).
 * @param y The y position of each point (typically in pixels).
 * @param target The desired number of points.
 * @returns The sorted original indices to keep.
 */
export function lttb(x: readonly number[], y: readonly number[], target: number): number[] {
  const length = Math.min(x.length, y.length);

  if (target >= length || target < 3) {
    return Array.from({ length }, (_, i) => i);
  }

  const sampled: number[] = [0];
  // The width of a bucket, excluding the always-kept first and last points.
  const bucketSize = (length - 2) / (target - 2);

  let previous = 0;

  for (let i = 0; i < target - 2; i += 1) {
    // Average point of the next bucket, used as the far vertex of the triangle.
    let avgX = 0;
    let avgY = 0;
    const nextStart = Math.floor((i + 1) * bucketSize) + 1;
    let nextEnd = Math.floor((i + 2) * bucketSize) + 1;
    nextEnd = Math.min(nextEnd, length);
    const nextSpan = nextEnd - nextStart || 1;
    for (let j = nextStart; j < nextEnd; j += 1) {
      avgX += x[j];
      avgY += y[j];
    }
    avgX /= nextSpan;
    avgY /= nextSpan;

    // Search the current bucket for the point forming the largest triangle.
    const currentStart = Math.floor(i * bucketSize) + 1;
    const currentEnd = Math.floor((i + 1) * bucketSize) + 1;
    const previousX = x[previous];
    const previousY = y[previous];

    let maxArea = -1;
    let maxIndex = currentStart;
    for (let j = currentStart; j < currentEnd; j += 1) {
      const area = Math.abs(
        (previousX - avgX) * (y[j] - previousY) - (previousX - x[j]) * (avgY - previousY),
      );
      if (area > maxArea) {
        maxArea = area;
        maxIndex = j;
      }
    }

    sampled.push(maxIndex);
    previous = maxIndex;
  }

  sampled.push(length - 1);
  return sampled;
}
