import {
  BAR_SUBSAMPLING_STRATEGIES,
  type BarSubsamplingStrategy,
} from './barSubsampling.strategies';
import type {
  BarSubsamplingBucket,
  BarSubsamplingLevel,
  BarSubsamplingPyramid,
  BarSubsamplingStrategyName,
} from './barSubsampling.types';

/** Smallest bar slot width (px) allowed before subsampling kicks in. */
export const MIN_BAR_WIDTH_PX = 4;

/**
 * Min zoom span (%) at which the data fills the view with `MIN_BAR_WIDTH_PX`-wide bars.
 * Screen-derived, so bars never get thinner and the level count adapts to screen + data.
 */
export function getSubsamplingMinSpan(dataLength: number, availableSizePx: number): number {
  const capacity = availableSizePx / MIN_BAR_WIDTH_PX;
  return (100 * capacity) / dataLength;
}

/** Builds the LOD pyramid for one series. Level 0 (no merge) is implicit; `levels[0]` merges 2. */
export function buildBarSubsamplingPyramid(
  stacked: readonly [number, number][],
  strategy: BarSubsamplingStrategy,
): BarSubsamplingPyramid {
  const dataLength = stacked.length;
  const levels: BarSubsamplingLevel[] = [];

  if (dataLength > 1) {
    const maxLevel = Math.ceil(Math.log2(dataLength));
    for (let levelIndex = 1; levelIndex <= maxLevel; levelIndex += 1) {
      const bucketSize = 2 ** levelIndex;
      const buckets: BarSubsamplingBucket[] = [];
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

export function getBarSubsamplingStrategy(
  name: BarSubsamplingStrategyName,
): BarSubsamplingStrategy {
  return BAR_SUBSAMPLING_STRATEGIES[name];
}

/** Resolves a level index (0 = no sampling) to a stored level, clamped to pyramid depth. */
function getLevelByIndex(
  pyramid: BarSubsamplingPyramid,
  levelIndex: number,
): BarSubsamplingLevel | null {
  if (levelIndex <= 0 || pyramid.levels.length === 0) {
    return null;
  }
  return pyramid.levels[Math.min(levelIndex, pyramid.levels.length) - 1];
}

/**
 * Picks the level from the zoom span: max zoom (`currentSpan === minSpan`) → no sampling;
 * each span doubling → bucket size ×2.
 */
export function selectBarSubsamplingLevelByZoom(
  currentSpan: number,
  minSpan: number,
  pyramid: BarSubsamplingPyramid,
): BarSubsamplingLevel | null {
  if (!(currentSpan > 0) || !(minSpan > 0)) {
    return null;
  }
  const levelIndex = Math.round(Math.log2(currentSpan / minSpan));
  return getLevelByIndex(pyramid, levelIndex);
}

/** Fallback for axes without zoom: picks the level from the bar slot width. */
export function selectBarSubsamplingLevel(
  bandwidthPx: number,
  pyramid: BarSubsamplingPyramid,
): BarSubsamplingLevel | null {
  if (!(bandwidthPx > 0) || bandwidthPx >= MIN_BAR_WIDTH_PX) {
    return null;
  }
  // Smallest factor-of-two that brings the slot back to at least MIN_BAR_WIDTH_PX.
  const levelIndex = Math.ceil(Math.log2(MIN_BAR_WIDTH_PX / bandwidthPx));
  return getLevelByIndex(pyramid, levelIndex);
}
