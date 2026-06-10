import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import {
  selectorChartExperimentalFeaturesState,
  type UseChartExperimentalFeaturesSignature,
} from '../../corePlugins/useChartExperimentalFeature';
import { type ChartState } from '../../models/chart';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { type UseProgressiveRenderingSignature } from './useProgressiveRendering.types';
import type { RendererType } from '../../../../ScatterChart';

/**
 * Total point count above which the auto (`renderer` unset) mode switches to
 * the progressive renderer. Below it the synchronous renderer is used, since
 * the progressive paint's overhead is not worth it for small datasets.
 */
const PROGRESSIVE_POINT_THRESHOLD = 20000;

/**
 * Target number of reveal commits. Each commit repaints every already-painted
 * circle, so the total progressive wall time is roughly `(C + 1) / 2` times a
 * single synchronous render (where `C` is the number of commits). Targeting
 * `5` commits keeps the progressive paint at roughly 2–3× the sync render time.
 */
const TARGET_PROGRESSIVE_COMMITS = 5;

/**
 * Lower bound for the per-tick reveal budget (total points across every
 * series). Prevents tiny commits whose React overhead would dominate.
 */
const MIN_BATCH_TOTAL = 1000;

/**
 * Upper bound for the per-tick reveal budget (total points across every
 * series). Prevents a single commit from blocking the main thread for too
 * long; very large datasets simply use more commits.
 */
const MAX_BATCH_TOTAL = 10000;

/**
 * Per-series points revealed per tick, derived from the total point count
 * across visible series and the number of visible series. The total per-tick
 * budget aims for {@link TARGET_PROGRESSIVE_COMMITS} commits, clamped by
 * {@link MIN_BATCH_TOTAL} / {@link MAX_BATCH_TOTAL}, then split evenly across
 * the visible series so every series progresses together.
 */
const getEffectiveBatchSize = (nSeries: number, totalPoints: number) => {
  const safeSeries = Math.max(1, nSeries);
  const safePoints = Math.max(1, totalPoints);
  const totalPerTick = Math.min(
    MAX_BATCH_TOTAL,
    Math.max(MIN_BATCH_TOTAL, Math.ceil(safePoints / TARGET_PROGRESSIVE_COMMITS)),
  );
  return Math.max(1, Math.floor(totalPerTick / safeSeries));
};

const selectorProgressiveState: ChartOptionalRootSelector<UseProgressiveRenderingSignature> = (
  state,
) => state.progressiveRendering;

/** Map of registered plots → their set of series ids. */
export const selectorProgressivePlans = createSelector(selectorProgressiveState, (s) => s?.plans);

/** Total number of rounds revealed across all plots so far. */
export const selectorProgressiveRevealedRounds = createSelector(
  selectorProgressiveState,
  (s) => s?.revealedRounds ?? 0,
);

/** Point count of a series, looked up across every processed series type. */
function getSeriesPointCount(processedSeries: ProcessedSeries, seriesId: SeriesId): number {
  for (const type in processedSeries) {
    if (!Object.hasOwn(processedSeries, type)) {
      continue;
    }
    const item = processedSeries[type as ChartSeriesType]?.series[seriesId];
    if (item) {
      return Array.isArray(item.data) ? item.data.length : 0;
    }
  }
  return 0;
}

/**
 * Aggregated view of every registered plan: the per-series batch counts, the
 * total number of rounds, and the per-series batch size (so every consumer
 * sizes its batches the same way). Point counts are read straight from the
 * processed series rather than carried by the registration.
 */
export const selectorProgressiveAggregate = createSelectorMemoized(
  selectorProgressivePlans,
  selectorChartSeriesProcessed,
  function selectorProgressiveAggregate(plans, processedSeries) {
    const nBatchesBySeries = new Map<SeriesId, number>();
    if (!plans || plans.size === 0) {
      return { nBatchesBySeries, totalRounds: 0, batchSize: MIN_BATCH_TOTAL };
    }

    let nSeries = 0;
    let totalPoints = 0;
    const pointCounts = new Map<SeriesId, number>();
    plans.forEach((seriesIds) => {
      seriesIds.forEach((seriesId) => {
        const nPoints = getSeriesPointCount(processedSeries, seriesId);
        pointCounts.set(seriesId, nPoints);
        nSeries += 1;
        totalPoints += nPoints;
      });
    });

    const batchSize = getEffectiveBatchSize(nSeries, totalPoints);

    let totalRounds = 0;
    pointCounts.forEach((nPoints, seriesId) => {
      const n = Math.max(1, Math.ceil(nPoints / batchSize));
      nBatchesBySeries.set(seriesId, n);
      if (n > totalRounds) {
        totalRounds = n;
      }
    });

    return { nBatchesBySeries, totalRounds, batchSize };
  },
);

export const selectorProgressiveBatchSize = createSelector(
  selectorProgressiveAggregate,
  (a) => a.batchSize,
);

export const selectorProgressiveTotalRounds = createSelector(
  selectorProgressiveAggregate,
  (a) => a.totalRounds,
);

/**
 * How many of `seriesId`'s own batches are revealed so far. Capped at that
 * series' total batch count, so series with fewer batches simply stop
 * progressing while longer ones keep filling in.
 */
export const selectorProgressiveSeriesRevealedBatches = createSelector(
  selectorProgressiveAggregate,
  selectorProgressiveRevealedRounds,
  function selectorProgressiveSeriesRevealedBatches(agg, revealed, seriesId: SeriesId) {
    return Math.min(revealed, agg.nBatchesBySeries.get(seriesId) ?? 0);
  },
);

/**
 * Whether `seriesIds` should be rendered progressively given the requested
 * `renderer`:
 * - `svg-single` / `svg-batch`: never (those are non-progressive renderers).
 * - `svg-progressive`: always.
 * - unset (auto): only when the `progressiveRendering` experimental feature is
 *   enabled and the total point count is above
 *   {@link PROGRESSIVE_POINT_THRESHOLD}. The flag keeps the auto behavior
 *   opt-in so the default (`svg-single`) stays non-breaking.
 */
const selectorProgressiveRenderingEnabled = (
  state: ChartState<[UseChartExperimentalFeaturesSignature<ChartSeriesType>]>,
) => selectorChartExperimentalFeaturesState(state, 'progressiveRendering');

export const selectorShouldUseProgressiveRenderer = createSelector(
  selectorChartSeriesProcessed,
  selectorProgressiveRenderingEnabled,
  (
    processedSeries,
    progressiveRenderingEnabled,
    seriesIds: readonly SeriesId[],
    renderer: RendererType | 'svg-progressive' | undefined,
  ) => {
    if (renderer === 'svg-single' || renderer === 'svg-batch') {
      return false;
    }
    if (renderer === 'svg-progressive') {
      return true;
    }
    if (!progressiveRenderingEnabled) {
      return false;
    }
    let totalPoints = 0;
    for (const seriesId of seriesIds) {
      totalPoints += getSeriesPointCount(processedSeries, seriesId);
    }
    return totalPoints > PROGRESSIVE_POINT_THRESHOLD;
  },
);

/** Order-sensitive equality between two registered series-id sets. */
export function sameSeriesIds(a: readonly SeriesId[] | undefined, b: readonly SeriesId[]): boolean {
  if (!a || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
