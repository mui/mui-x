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

/**
 * Minimum on-screen width (px) a bar slot is allowed to reach before subsampling kicks in.
 * Levels are spaced by a factor of two, so the effective slot width stays within
 * `[MIN_BAR_WIDTH_PX, 2 * MIN_BAR_WIDTH_PX)` — keeping bar-size transitions smooth while zooming.
 */
export const MIN_BAR_WIDTH_PX = 4;

/**
 * Builds the level-of-detail pyramid for a single series from its stacked values.
 * Level 0 (one bar per data point) is implicit, so the first stored level already merges two bars.
 */
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

/**
 * Picks the active level for a pyramid given the current on-screen width of one bar slot.
 * Returns `null` when bars are wide enough to render every data point (no subsampling).
 *
 * @param bandwidthPx The pixel width of a single category slot at the current zoom.
 * @param pyramid The precomputed pyramid for the series.
 */
export function selectBarSubsamplingLevel(
  bandwidthPx: number,
  pyramid: BarSubsamplingPyramid,
): BarSubsamplingLevel | null {
  if (!(bandwidthPx > 0) || bandwidthPx >= MIN_BAR_WIDTH_PX || pyramid.levels.length === 0) {
    return null;
  }
  // Smallest factor-of-two that brings the slot back to at least MIN_BAR_WIDTH_PX.
  const levelIndex = Math.ceil(Math.log2(MIN_BAR_WIDTH_PX / bandwidthPx));
  return pyramid.levels[Math.min(levelIndex, pyramid.levels.length) - 1];
}
