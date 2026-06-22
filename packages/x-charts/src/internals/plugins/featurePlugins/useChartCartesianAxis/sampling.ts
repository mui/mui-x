import type { ActiveSamplingLevel, SamplingPyramid } from './sampling.types';

/** Smallest element size (px) allowed before sampling kicks in. */
export const MIN_ELEMENT_SIZE_PX = 6;

/**
 * Min zoom span (%) at which the data fills the view with `MIN_ELEMENT_SIZE_PX`-wide elements.
 * Screen-derived, so elements never get thinner and the level count adapts to screen + data.
 */
export function getSamplingMinSpan(dataLength: number, availableSizePx: number): number {
  return (100 * availableSizePx) / (MIN_ELEMENT_SIZE_PX * dataLength);
}

const EMPTY_PYRAMID_OFFSETS = new Int32Array(1);

/**
 * Builds the LOD pyramid for one series from its low/high value channels (for bars: the stacked
 * `[base, top]` channels; for lines: the displayed `y` for both). Each bucket keeps the original
 * index of its min (over `low`) and max (over `high`) — a min/max envelope, so spikes and troughs
 * survive. Consumers read the values back from their own series data by index.
 *
 * Stored flat: all levels concatenated into `argMin`/`argMax`, with `offsets` marking level
 * boundaries. Level 0 (no merge) is implicit; bucket indices are derived (`j * bucketSize`).
 */
export function buildSamplingPyramid(
  low: ArrayLike<number>,
  high: ArrayLike<number>,
): SamplingPyramid {
  const dataLength = low.length;

  if (dataLength <= 1) {
    return {
      dataLength,
      argMin: new Int32Array(0),
      argMax: new Int32Array(0),
      offsets: EMPTY_PYRAMID_OFFSETS,
    };
  }

  const levelCount = Math.ceil(Math.log2(dataLength));

  // Level start offsets into the shared buffers; each level halves the previous count (round up).
  const offsets = new Int32Array(levelCount + 1);
  for (let levelIndex = 0, count = dataLength; levelIndex < levelCount; levelIndex += 1) {
    count = Math.ceil(count / 2);
    offsets[levelIndex + 1] = offsets[levelIndex] + count;
  }

  const argMin = new Int32Array(offsets[levelCount]);
  const argMax = new Int32Array(offsets[levelCount]);

  // Level 0 (bucketSize 2) merges adjacent raw points; the only level that scans raw data.
  for (let j = 0, i = 0; i < dataLength; j += 1, i += 2) {
    const next = i + 1;
    let lo = i;
    let hi = i;
    if (next < dataLength) {
      if (low[next] < low[i]) {
        lo = next;
      }
      if (high[next] > high[i]) {
        hi = next;
      }
    }
    argMin[j] = lo;
    argMax[j] = hi;
  }

  // Higher levels merge pairs of buckets from the level below (argMin/argMax are associative via
  // value compare, so the result equals re-scanning raw data). n/2 + n/4 + ... → O(n) build.
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
        argMin[w] = low[argMin[a]] <= low[argMin[b]] ? argMin[a] : argMin[b];
        argMax[w] = high[argMax[a]] >= high[argMax[b]] ? argMax[a] : argMax[b];
      }
    }
  }

  return { dataLength, argMin, argMax, offsets };
}

/** Number of stored levels (finest `bucketSize 2` to coarsest). */
export function getSamplingLevelCount(pyramid: SamplingPyramid): number {
  return pyramid.offsets.length - 1;
}

/** Level index from the zoom span: 0 at max zoom (`currentSpan === minSpan`), +1 per span doubling. */
export function levelIndexFromSpan(currentSpan: number, minSpan: number): number {
  if (!(currentSpan > 0) || !(minSpan > 0)) {
    return 0;
  }
  return Math.max(0, Math.round(Math.log2(currentSpan / minSpan)));
}

/**
 * Picks the active level from the zoom span: max zoom (`currentSpan === minSpan`) → no sampling
 * (`null`); each span doubling → bucket size ×2. Clamped to the pyramid depth.
 */
export function selectSamplingLevel(
  pyramid: SamplingPyramid,
  currentSpan: number,
  minSpan: number,
): ActiveSamplingLevel | null {
  const levelCount = getSamplingLevelCount(pyramid);
  const levelIndex = levelIndexFromSpan(currentSpan, minSpan);
  if (levelIndex <= 0 || levelCount === 0) {
    return null;
  }
  const storedLevel = Math.min(levelIndex, levelCount) - 1;
  return {
    bucketSize: 2 ** (storedLevel + 1),
    start: pyramid.offsets[storedLevel],
    end: pyramid.offsets[storedLevel + 1],
  };
}

/** Active bucket size for the given span (`1` = no sampling) — matches {@link selectSamplingLevelByZoom}. */
export function getSamplingBucketSize(
  currentSpan: number,
  minSpan: number,
  dataLength: number,
): number {
  const levelIndex = levelIndexFromSpan(currentSpan, minSpan);
  if (levelIndex <= 0 || dataLength <= 1) {
    return 1;
  }
  return 2 ** Math.min(levelIndex, Math.ceil(Math.log2(dataLength)));
}
