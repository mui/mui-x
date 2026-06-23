import type { LineSamplingAlgorithm, SampleContext, SampledBucket } from '@mui/x-charts/internals';
import { selectSamplingLevel } from './sampling';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * The active level of detail as buckets for the current zoom, or `null` for no sampling. Each bucket
 * carries its original-index span plus the ascending indices to render. The same output feeds both
 * series types: lines flatten the indices into a polyline, bars draw one merged rect per bucket.
 *
 * `minmax` (default; bars use it) keeps {min, max} per bucket; `m4` also brackets them with the
 * bucket's first/last (pixel-accurate); both read the shared {@link SamplingPyramid}. `lttb` ignores
 * the pyramid and reduces on demand to one point per bucket (plus endpoints), reading raw values
 * from `getValues` (called only for `lttb`) as a single whole-range bucket.
 */
export function sampleBuckets(
  pyramid: SamplingPyramid,
  currentSpan: number,
  availableSizePx: number,
  minSpan: number,
  algorithm: LineSamplingAlgorithm = 'minmax',
  getValues?: () => ArrayLike<number>,
): SampledBucket[] | null {
  const level = selectSamplingLevel(pyramid, currentSpan, availableSizePx, minSpan);
  if (!level) {
    return null;
  }

  const { bucketSize, start, end } = level;
  const maxIndex = pyramid.dataLength - 1;

  if (algorithm === 'lttb') {
    const indices = largestTriangleThreeBuckets(
      getValues!(),
      Math.ceil(pyramid.dataLength / bucketSize),
    );
    return [{ startIndex: 0, endIndex: maxIndex, indices }];
  }

  const { argMin, argMax } = pyramid;
  const withEnds = algorithm === 'm4';
  const buckets: SampledBucket[] = [];

  for (let j = start; j < end; j += 1) {
    const bucket = j - start;
    const startIndex = bucket * bucketSize;
    const endIndex = Math.min(startIndex + bucketSize - 1, maxIndex);
    // Extrema in ascending index order; `m4` also brackets them with the bucket's first/last.
    const extremaFirst = Math.min(argMin[j], argMax[j]);
    const extremaLast = Math.max(argMin[j], argMax[j]);
    const ordered = withEnds
      ? [startIndex, extremaFirst, extremaLast, endIndex]
      : [extremaFirst, extremaLast];

    // Drop duplicates, ascending, within the bucket (extrema can coincide, or equal ends for `m4`).
    const indices: number[] = [];
    let prev = -1;
    for (let k = 0; k < ordered.length; k += 1) {
      if (ordered[k] !== prev) {
        indices.push(ordered[k]);
        prev = ordered[k];
      }
    }
    buckets.push({ startIndex, endIndex, indices: Int32Array.from(indices) });
  }

  return buckets;
}

/** Shared `sample` for every series type; the per-type build feeds the channels into the pyramid. */
export function sample(context: SampleContext): SampledBucket[] | null {
  const { zoom } = context;
  if (!zoom) {
    return null;
  }
  return sampleBuckets(
    context.built as SamplingPyramid,
    zoom.end - zoom.start,
    context.availableSize,
    context.minSpan,
    context.algorithm,
    context.getValues,
  );
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
