import type { SamplingLevel, SamplingPyramid } from './sampling.types';

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
 * Builds the LOD pyramid for one series from its stacked `[base, top]` values. Each bucket keeps
 * the min base / max top of its range (min/max envelope, so spikes and troughs survive).
 * Other aggregations to consider if needed: max (peak only), average, stride (keep the first).
 *
 * Stored flat: all levels concatenated into one `min` and one `max` `Float64Array`, with
 * `offsets` marking level boundaries. Level 0 (no merge) is implicit; bucket indices are derived
 * (`j * bucketSize`) rather than stored.
 */
export function buildSamplingPyramid(stacked: readonly [number, number][]): SamplingPyramid {
  const dataLength = stacked.length;

  if (dataLength <= 1) {
    return {
      dataLength,
      min: new Float64Array(0),
      max: new Float64Array(0),
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

  const min = new Float64Array(offsets[levelCount]);
  const max = new Float64Array(offsets[levelCount]);

  // Level 0 (bucketSize 2) merges adjacent raw points; the only level that scans raw data.
  for (let j = 0, startIndex = 0; startIndex < dataLength; j += 1, startIndex += 2) {
    const endIndex = startIndex + 1;
    let bucketMin = stacked[startIndex][0];
    let bucketMax = stacked[startIndex][1];
    if (endIndex < dataLength) {
      if (stacked[endIndex][0] < bucketMin) {
        bucketMin = stacked[endIndex][0];
      }
      if (stacked[endIndex][1] > bucketMax) {
        bucketMax = stacked[endIndex][1];
      }
    }
    min[j] = bucketMin;
    max[j] = bucketMax;
  }

  // Higher levels merge pairs of buckets from the level below, reading/writing the shared buffers
  // by offset (min/max are associative, so the result equals re-scanning raw data).
  // n/2 + n/4 + ... visits total → O(n) build.
  for (let levelIndex = 1; levelIndex < levelCount; levelIndex += 1) {
    const prevStart = offsets[levelIndex - 1];
    const prevCount = offsets[levelIndex] - prevStart;
    const start = offsets[levelIndex];
    for (let i = 0, j = 0; i < prevCount; i += 2, j += 1) {
      const a = prevStart + i;
      const w = start + j;
      if (i + 1 >= prevCount) {
        min[w] = min[a];
        max[w] = max[a];
      } else {
        const b = a + 1;
        min[w] = min[a] < min[b] ? min[a] : min[b];
        max[w] = max[a] > max[b] ? max[a] : max[b];
      }
    }
  }

  return { dataLength, min, max, offsets };
}

/** Number of stored levels (finest `bucketSize 2` to coarsest). */
export function getSamplingLevelCount(pyramid: SamplingPyramid): number {
  return pyramid.offsets.length - 1;
}

/** Ephemeral view of stored level `index` (0-based; `bucketSize === 2 ** (index + 1)`). */
export function getSamplingLevel(pyramid: SamplingPyramid, index: number): SamplingLevel {
  const start = pyramid.offsets[index];
  const end = pyramid.offsets[index + 1];
  return {
    bucketSize: 2 ** (index + 1),
    min: pyramid.min.subarray(start, end),
    max: pyramid.max.subarray(start, end),
  };
}

/** Level index from the zoom span: 0 at max zoom (`currentSpan === minSpan`), +1 per span doubling. */
export function levelIndexFromSpan(currentSpan: number, minSpan: number): number {
  if (!(currentSpan > 0) || !(minSpan > 0)) {
    return 0;
  }
  return Math.max(0, Math.round(Math.log2(currentSpan / minSpan)));
}

/**
 * Picks the level from the zoom span: max zoom (`currentSpan === minSpan`) → no sampling (`null`);
 * each span doubling → bucket size ×2. Clamped to the pyramid depth.
 */
export function selectSamplingLevelByZoom(
  currentSpan: number,
  minSpan: number,
  pyramid: SamplingPyramid,
): SamplingLevel | null {
  const levelCount = getSamplingLevelCount(pyramid);
  const levelIndex = levelIndexFromSpan(currentSpan, minSpan);
  return levelIndex <= 0 || levelCount === 0
    ? null
    : getSamplingLevel(pyramid, Math.min(levelIndex, levelCount) - 1);
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
