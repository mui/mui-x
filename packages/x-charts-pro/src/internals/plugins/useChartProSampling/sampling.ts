import type { ActiveSamplingLevel, SamplingPyramid } from './sampling.pyramid.types';

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
 * Level 0 (raw) extends this factor above `minSpan` before the first sampled level kicks in — a
 * half-octave of wiggle room so the deepest zoom stays unsampled without a knife-edge transition.
 */
const RAW_LEVEL_SPAN_FACTOR = Math.SQRT2;

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

/**
 * Level-of-detail index for the current zoom:
 * - Level 0 (no sampling, raw) at the deepest zoom (`currentSpan <= minSpan * RAW_LEVEL_SPAN_FACTOR`),
 *   whatever the bar size — fully zoomed in always shows every point.
 * - Above that, the level is screen-defined: bucket size keeps elements at least
 *   `MIN_ELEMENT_SIZE_PX` wide (+1 per span doubling past that pixel threshold).
 */
function levelIndexFor(
  currentSpan: number,
  dataLength: number,
  availableSizePx: number,
  minSpan: number,
): number {
  if (!(currentSpan > 0) || currentSpan <= minSpan * RAW_LEVEL_SPAN_FACTOR) {
    return 0;
  }
  const screenMinSpan = getSamplingMinSpan(dataLength, availableSizePx);
  if (!(screenMinSpan > 0)) {
    return 0;
  }
  return Math.max(0, Math.round(Math.log2(currentSpan / screenMinSpan)));
}

/**
 * Picks the active level from the zoom span: level 0 (deepest zoom, `span <= minSpan`, or elements
 * still wide enough) → no sampling (`null`, raw 1:1); each level up → bucket size ×2, chosen so
 * sampled elements stay at least `MIN_ELEMENT_SIZE_PX` wide. Clamped to the pyramid depth.
 * `bucketSize === 2 ** clampedLevel`, level buckets `offsets[clampedLevel - 1 .. clampedLevel]`.
 */
export function selectSamplingLevel(
  pyramid: SamplingPyramid,
  currentSpan: number,
  availableSizePx: number,
  minSpan: number,
): ActiveSamplingLevel | null {
  const levelCount = pyramid.offsets.length - 1;
  const levelIndex = levelIndexFor(currentSpan, pyramid.dataLength, availableSizePx, minSpan);
  if (levelIndex <= 0 || levelCount === 0) {
    return null;
  }
  const clampedLevel = Math.min(levelIndex, levelCount);
  return {
    bucketSize: 2 ** clampedLevel,
    start: pyramid.offsets[clampedLevel - 1],
    end: pyramid.offsets[clampedLevel],
  };
}

/**
 * Active bucket size (`1` = no sampling) for an axis with no built pyramid (the axis highlight).
 * Matches {@link selectSamplingLevel}'s `bucketSize`, derived from `dataLength` + screen + `minSpan`.
 */
export function getSamplingBucketSize(
  currentSpan: number,
  dataLength: number,
  availableSizePx: number,
  minSpan: number,
): number {
  const levelIndex = levelIndexFor(currentSpan, dataLength, availableSizePx, minSpan);
  if (levelIndex <= 0 || dataLength <= 1) {
    return 1;
  }
  return 2 ** Math.min(levelIndex, Math.ceil(Math.log2(dataLength)));
}
