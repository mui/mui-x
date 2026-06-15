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
 * Resolves a level index (0 = no sampling) to a stored level, clamped to the pyramid depth.
 * `pyramid.levels[i]` has `bucketSize === 2 ** (i + 1)`, so level index `k` maps to `levels[k - 1]`.
 */
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
 * Picks the active level from the zoom span. Anchored so the deepest zoom (`currentSpan === minSpan`)
 * renders every data point (level 0, no sampling); each zoom-out step that doubles the visible span
 * halves the rendered points (bucket size ×2). The number of available levels is fixed by the
 * pyramid (`ceil(log2(N))`), computed once when the data changes.
 *
 * @param currentSpan The visible span in percent (`zoom.end - zoom.start`, 0–100).
 * @param minSpan The smallest span the axis can zoom to (max zoom-in), in percent.
 * @param pyramid The precomputed pyramid for the series.
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

/**
 * Picks the active level for a pyramid given the current on-screen width of one bar slot.
 * Used as a fallback for axes without zoom, where there is no span to derive a level from.
 * Returns `null` when bars are wide enough to render every data point (no subsampling).
 *
 * @param bandwidthPx The pixel width of a single category slot at the current zoom.
 * @param pyramid The precomputed pyramid for the series.
 */
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
