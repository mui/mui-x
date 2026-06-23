import type { LineSamplingAlgorithm } from '@mui/x-charts/internals';
import { selectSamplingLevel } from './sampling';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Original indices to render for the current zoom, sorted ascending, or `null` for no sampling.
 * `m4` keeps {first, min, max, last} per bucket (pixel-accurate); `minmax` keeps {min, max}; both
 * read the shared {@link SamplingPyramid}. `lttb` ignores the pyramid and reduces on demand to one
 * point per bucket (plus endpoints), reading raw values from `getValues` (called only for `lttb`).
 */
export function selectLineSampledIndices(
  pyramid: SamplingPyramid,
  currentSpan: number,
  availableSizePx: number,
  algorithm: LineSamplingAlgorithm,
  getValues: () => ArrayLike<number>,
): Int32Array | null {
  const level = selectSamplingLevel(pyramid, currentSpan, availableSizePx);
  if (!level) {
    return null;
  }

  const { bucketSize, start, end } = level;

  if (algorithm === 'lttb') {
    return largestTriangleThreeBuckets(getValues(), Math.ceil(pyramid.dataLength / bucketSize));
  }

  const { argMin, argMax } = pyramid;
  const maxIndex = pyramid.dataLength - 1;
  const withEnds = algorithm === 'm4';

  // At most 4 indices per bucket; collect then sort/dedup per bucket to keep global ascending order.
  const indices: number[] = [];
  let prev = -1;
  const push = (index: number) => {
    if (index !== prev) {
      indices.push(index);
      prev = index;
    }
  };

  for (let j = start; j < end; j += 1) {
    const bucket = j - start;
    // Extrema in ascending index order; `m4` also brackets them with the bucket's first/last.
    const extremaFirst = Math.min(argMin[j], argMax[j]);
    const extremaLast = Math.max(argMin[j], argMax[j]);
    const ordered = withEnds
      ? [
          bucket * bucketSize,
          extremaFirst,
          extremaLast,
          Math.min((bucket + 1) * bucketSize - 1, maxIndex),
        ]
      : [extremaFirst, extremaLast];
    for (let k = 0; k < ordered.length; k += 1) {
      push(ordered[k]);
    }
  }

  return Int32Array.from(indices);
}

/**
 * Largest-Triangle-Three-Buckets downsampling. Returns `threshold` original indices (including the
 * first and last) chosen to preserve the line's visual shape. Uses the data index as the x channel.
 * @see https://skemman.is/handle/1946/15343 (Sveinn Steinarsson, 2013)
 */
export function largestTriangleThreeBuckets(
  values: ArrayLike<number>,
  threshold: number,
): Int32Array {
  const dataLength = values.length;
  if (threshold >= dataLength || threshold <= 2) {
    return Int32Array.from({ length: dataLength }, (_, i) => i);
  }

  const sampled = new Int32Array(threshold);
  let sampledIndex = 0;
  sampled[sampledIndex] = 0; // always keep the first point
  sampledIndex += 1;

  // Middle buckets span indices [1, dataLength - 1); the last point is fixed separately.
  const bucketSize = (dataLength - 2) / (threshold - 2);
  let a = 0; // index of the previously selected point

  for (let i = 0; i < threshold - 2; i += 1) {
    // Average point of the next bucket (the third triangle vertex).
    const avgStart = Math.floor((i + 1) * bucketSize) + 1;
    let avgEnd = Math.floor((i + 2) * bucketSize) + 1;
    if (avgEnd > dataLength) {
      avgEnd = dataLength;
    }
    let avgX = 0;
    let avgY = 0;
    const avgCount = avgEnd - avgStart;
    for (let k = avgStart; k < avgEnd; k += 1) {
      avgX += k;
      avgY += values[k];
    }
    if (avgCount > 0) {
      avgX /= avgCount;
      avgY /= avgCount;
    } else {
      avgX = dataLength - 1;
      avgY = values[dataLength - 1];
    }

    const rangeStart = Math.floor(i * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 1) * bucketSize) + 1;
    const ax = a;
    const ay = values[a];
    let maxArea = -1;
    let chosen = rangeStart;
    for (let k = rangeStart; k < rangeEnd; k += 1) {
      const area = Math.abs((ax - avgX) * (values[k] - ay) - (ax - k) * (avgY - ay));
      if (area > maxArea) {
        maxArea = area;
        chosen = k;
      }
    }
    sampled[sampledIndex] = chosen;
    sampledIndex += 1;
    a = chosen;
  }

  sampled[sampledIndex] = dataLength - 1; // always keep the last point
  return sampled;
}
