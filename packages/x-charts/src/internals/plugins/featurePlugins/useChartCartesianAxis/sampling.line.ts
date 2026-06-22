import { levelIndexFromSpan } from './sampling';
import type { LineSamplingAlgorithm } from './sampling.types';

/**
 * Index-extrema LOD pyramid for one line series. Stores, per bucket, the original index of the
 * minimum and maximum value (`argMin`/`argMax`); first/last indices are the bucket bounds (derived).
 * Mergeable across levels, so it powers both `minmax` and `m4` without rebuilding.
 */
export interface LineSamplingData {
  dataLength: number;
  /** Source values (one per original index), kept for on-demand `lttb`. */
  values: Float64Array;
  /** Concatenated per-level argMin indices, finest to coarsest. */
  argMin: Int32Array;
  /** Concatenated per-level argMax indices, same order. */
  argMax: Int32Array;
  /** Level start offsets into `argMin`/`argMax`; length `levelCount + 1`. */
  offsets: Int32Array;
}

const EMPTY_OFFSETS = new Int32Array(1);

/** Builds the index-extrema pyramid over `values` (e.g. a line's displayed y per index). */
export function buildLineSamplingData(values: Float64Array): LineSamplingData {
  const dataLength = values.length;

  if (dataLength <= 1) {
    return {
      dataLength,
      values,
      argMin: new Int32Array(0),
      argMax: new Int32Array(0),
      offsets: EMPTY_OFFSETS,
    };
  }

  const levelCount = Math.ceil(Math.log2(dataLength));
  const offsets = new Int32Array(levelCount + 1);
  for (let levelIndex = 0, count = dataLength; levelIndex < levelCount; levelIndex += 1) {
    count = Math.ceil(count / 2);
    offsets[levelIndex + 1] = offsets[levelIndex] + count;
  }

  const argMin = new Int32Array(offsets[levelCount]);
  const argMax = new Int32Array(offsets[levelCount]);

  // Level 0 (bucketSize 2): scan raw values.
  for (let j = 0, i = 0; i < dataLength; j += 1, i += 2) {
    const next = i + 1;
    let lo = i;
    let hi = i;
    if (next < dataLength) {
      if (values[next] < values[i]) {
        lo = next;
      }
      if (values[next] > values[i]) {
        hi = next;
      }
    }
    argMin[j] = lo;
    argMax[j] = hi;
  }

  // Higher levels merge pairs from the level below (argMin/argMax are associative via value compare).
  for (let levelIndex = 1; levelIndex < levelCount; levelIndex += 1) {
    const prevStart = offsets[levelIndex - 1];
    const prevCount = offsets[levelIndex] - prevStart;
    const start = offsets[levelIndex];
    for (let i = 0, j = 0; i < prevCount; i += 2, j += 1) {
      const a = prevStart + i;
      const w = start + j;
      if (i + 1 >= prevCount) {
        argMin[w] = argMin[a];
        argMax[w] = argMax[a];
      } else {
        const b = a + 1;
        argMin[w] = values[argMin[a]] <= values[argMin[b]] ? argMin[a] : argMin[b];
        argMax[w] = values[argMax[a]] >= values[argMax[b]] ? argMax[a] : argMax[b];
      }
    }
  }

  return { dataLength, values, argMin, argMax, offsets };
}

/** Number of stored levels (finest `bucketSize 2` to coarsest). */
export function getLineSamplingLevelCount(data: LineSamplingData): number {
  return data.offsets.length - 1;
}

/**
 * Original indices to render for the current zoom, sorted ascending, or `null` for no sampling.
 * `m4` keeps {first, min, max, last} per bucket (pixel-accurate); `minmax` keeps {min, max}.
 * `lttb` ignores the pyramid and reduces on demand to one point per bucket (plus endpoints).
 */
export function selectLineSampledIndices(
  data: LineSamplingData,
  currentSpan: number,
  minSpan: number,
  algorithm: LineSamplingAlgorithm,
): Int32Array | null {
  const levelCount = getLineSamplingLevelCount(data);
  const levelIndex = levelIndexFromSpan(currentSpan, minSpan);
  if (levelIndex <= 0 || levelCount === 0) {
    return null;
  }

  const storedLevel = Math.min(levelIndex, levelCount) - 1;
  const bucketSize = 2 ** (storedLevel + 1);

  if (algorithm === 'lttb') {
    const targetCount = Math.ceil(data.dataLength / bucketSize);
    return largestTriangleThreeBuckets(data.values, targetCount);
  }

  const start = data.offsets[storedLevel];
  const end = data.offsets[storedLevel + 1];
  const maxIndex = data.dataLength - 1;
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
    const extremaFirst = Math.min(data.argMin[j], data.argMax[j]);
    const extremaLast = Math.max(data.argMin[j], data.argMax[j]);
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
export function largestTriangleThreeBuckets(values: Float64Array, threshold: number): Int32Array {
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
