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
    for (let levelIndex = 1; levelIndex <= maxLevel; levelIndex += 1) {
      const bucketSize = 2 ** levelIndex;
      const buckets: SamplingBucket[] = [];
      for (let startIndex = 0; startIndex < dataLength; startIndex += bucketSize) {
        const endIndex = Math.min(startIndex + bucketSize - 1, dataLength - 1);
        let low = Infinity;
        let high = -Infinity;
        for (let i = startIndex; i <= endIndex; i += 1) {
          if (stacked[i][0] < low) {
            low = stacked[i][0];
          }
          if (stacked[i][1] > high) {
            high = stacked[i][1];
          }
        }
        buckets.push({ startIndex, endIndex, low, high });
      }
      levels.push({ bucketSize, buckets });
    }
  }

  return { dataLength, levels };
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
  if (!(currentSpan > 0) || !(minSpan > 0) || levels.length === 0) {
    return null;
  }
  const levelIndex = Math.round(Math.log2(currentSpan / minSpan));
  return levelIndex <= 0 ? null : levels[Math.min(levelIndex, levels.length) - 1];
}
