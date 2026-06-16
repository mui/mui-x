import {
  SAMPLING_STRATEGIES,
  type SamplingStrategy,
} from './sampling.strategies';
import type {
  SamplingBucket,
  SamplingLevel,
  SamplingPyramid,
  SamplingStrategyName,
} from './sampling.types';

/** Smallest element size (px) allowed before sampling kicks in. */
export const MIN_ELEMENT_SIZE_PX = 4;

/**
 * Min zoom span (%) at which the data fills the view with `MIN_ELEMENT_SIZE_PX`-wide elements.
 * Screen-derived, so elements never get thinner and the level count adapts to screen + data.
 */
export function getSamplingMinSpan(dataLength: number, availableSizePx: number): number {
  const capacity = availableSizePx / MIN_ELEMENT_SIZE_PX;
  return (100 * capacity) / dataLength;
}

/** Builds the LOD pyramid for one series. Level 0 (no merge) is implicit; `levels[0]` merges 2. */
export function buildSamplingPyramid(
  stacked: readonly [number, number][],
  strategy: SamplingStrategy,
): SamplingPyramid {
  const dataLength = stacked.length;
  const levels: SamplingLevel[] = [];

  if (dataLength > 1) {
    const maxLevel = Math.ceil(Math.log2(dataLength));
    for (let levelIndex = 1; levelIndex <= maxLevel; levelIndex += 1) {
      const bucketSize = 2 ** levelIndex;
      const buckets: SamplingBucket[] = [];
      for (let startIndex = 0; startIndex < dataLength; startIndex += bucketSize) {
        const endIndex = Math.min(startIndex + bucketSize - 1, dataLength - 1);
        const { low, high } = strategy(stacked, startIndex, endIndex);
        buckets.push({ startIndex, endIndex, low, high });
      }
      levels.push({ bucketSize, buckets });
    }
  }

  return { dataLength, levels };
}

export function getSamplingStrategy(
  name: SamplingStrategyName,
): SamplingStrategy {
  return SAMPLING_STRATEGIES[name];
}

/** Resolves a level index (0 = no sampling) to a stored level, clamped to pyramid depth. */
function getLevelByIndex(
  pyramid: SamplingPyramid,
  levelIndex: number,
): SamplingLevel | null {
  if (levelIndex <= 0 || pyramid.levels.length === 0) {
    return null;
  }
  return pyramid.levels[Math.min(levelIndex, pyramid.levels.length) - 1];
}

/**
 * Picks the level from the zoom span: max zoom (`currentSpan === minSpan`) → no sampling;
 * each span doubling → bucket size ×2.
 */
export function selectSamplingLevelByZoom(
  currentSpan: number,
  minSpan: number,
  pyramid: SamplingPyramid,
): SamplingLevel | null {
  if (!(currentSpan > 0) || !(minSpan > 0)) {
    return null;
  }
  const levelIndex = Math.round(Math.log2(currentSpan / minSpan));
  return getLevelByIndex(pyramid, levelIndex);
}

/** Fallback for axes without zoom: picks the level from the element width. */
export function selectSamplingLevel(
  bandwidthPx: number,
  pyramid: SamplingPyramid,
): SamplingLevel | null {
  if (!(bandwidthPx > 0) || bandwidthPx >= MIN_ELEMENT_SIZE_PX) {
    return null;
  }
  // Smallest factor-of-two that brings the slot back to at least MIN_ELEMENT_SIZE_PX.
  const levelIndex = Math.ceil(Math.log2(MIN_ELEMENT_SIZE_PX / bandwidthPx));
  return getLevelByIndex(pyramid, levelIndex);
}
