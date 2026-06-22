import type { SamplingBucket, SamplingLevel, SamplingPyramid } from './sampling.types';

/** Smallest element size (px) allowed before sampling kicks in. */
export const MIN_ELEMENT_SIZE_PX = 6;

/**
 * Min zoom span (%) at which the data fills the view with `MIN_ELEMENT_SIZE_PX`-wide elements.
 * Screen-derived, so elements never get thinner and the level count adapts to screen + data.
 */
export function getSamplingMinSpan(dataLength: number, availableSizePx: number): number {
  return (100 * availableSizePx) / (MIN_ELEMENT_SIZE_PX * dataLength);
}

/**
 * Builds the LOD pyramid for one series from its stacked `[base, top]` values. Each bucket keeps
 * the min base / max top of its range (min/max envelope, so spikes and troughs survive).
 * Other aggregations to consider if needed: max (peak only), average, stride (keep the first).
 * Level 0 (no merge) is implicit; `levels[i].bucketSize === 2 ** (i + 1)`.
 */
export function buildSamplingPyramid(stacked: readonly [number, number][]): SamplingPyramid {
  const dataLength = stacked.length;
  const levels: SamplingLevel[] = [];

  if (dataLength > 1) {
    const maxLevel = Math.ceil(Math.log2(dataLength));

    // Level 1 (bucketSize 2) merges adjacent raw points; the only level that scans raw data.
    const firstBuckets: SamplingBucket[] = [];
    for (let startIndex = 0; startIndex < dataLength; startIndex += 2) {
      const endIndex = Math.min(startIndex + 1, dataLength - 1);
      let low = stacked[startIndex][0];
      let high = stacked[startIndex][1];
      if (endIndex > startIndex) {
        low = Math.min(low, stacked[endIndex][0]);
        high = Math.max(high, stacked[endIndex][1]);
      }
      firstBuckets.push({ startIndex, endIndex, low, high });
    }
    levels.push({ bucketSize: 2, buckets: firstBuckets });

    // Higher levels merge pairs of buckets from the level below (min/max are associative, so the
    // result is identical to re-scanning raw data). n/2 + n/4 + ... visits total → O(n) build.
    for (let levelIndex = 2; levelIndex <= maxLevel; levelIndex += 1) {
      const prevBuckets = levels[levelIndex - 2].buckets;
      const buckets: SamplingBucket[] = [];
      for (let i = 0; i < prevBuckets.length; i += 2) {
        const left = prevBuckets[i];
        const right = prevBuckets[i + 1];
        if (right === undefined) {
          buckets.push(left);
        } else {
          buckets.push({
            startIndex: left.startIndex,
            endIndex: right.endIndex,
            low: left.low < right.low ? left.low : right.low,
            high: left.high > right.high ? left.high : right.high,
          });
        }
      }
      levels.push({ bucketSize: 2 ** levelIndex, buckets });
    }
  }

  return { dataLength, levels };
}

/** Level index from the zoom span: 0 at max zoom (`currentSpan === minSpan`), +1 per span doubling. */
function levelIndexFromSpan(currentSpan: number, minSpan: number): number {
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
  const { levels } = pyramid;
  const levelIndex = levelIndexFromSpan(currentSpan, minSpan);
  return levelIndex <= 0 || levels.length === 0
    ? null
    : levels[Math.min(levelIndex, levels.length) - 1];
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
