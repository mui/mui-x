import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import {
  selectorChartExperimentalFeaturesState,
  type UseChartExperimentalFeaturesSignature,
} from '../../corePlugins/useChartExperimentalFeature';
import { selectorChartZoomIsInteracting } from '../useChartCartesianAxis';
import { type ChartState } from '../../models/chart';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { type UseProgressiveRenderingSignature } from './useProgressiveRendering.types';
import type { RendererType } from '../../../../ScatterChart';

/** Auto mode switches to the progressive renderer above this total point count. */
const PROGRESSIVE_POINT_THRESHOLD = 20000;

/** Target reveal commits. Progressive wall time ≈ `(C + 1) / 2` × a sync render. */
const TARGET_PROGRESSIVE_COMMITS = 5;

/** Min per-tick reveal budget (total points). Avoids tiny React-bound commits. */
const MIN_BATCH_TOTAL = 1000;

/** Max per-tick reveal budget (total points). Caps main-thread block per commit. */
const MAX_BATCH_TOTAL = 10000;

/**
 * Per-series points per tick: total budget aims for
 * {@link TARGET_PROGRESSIVE_COMMITS} commits, clamped by
 * {@link MIN_BATCH_TOTAL}/{@link MAX_BATCH_TOTAL}, split evenly across series.
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
 * Aggregate of every plan: per-series batch counts, total rounds, and batch
 * size (so every consumer sizes batches the same). Point counts read from the
 * processed series, not the registration.
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
 * Revealed batch count for a series: `revealed` rounds normally, clamped to the
 * first batch while interacting, never above `total`.
 */
export function getRevealedBatchCount(
  total: number,
  revealed: number,
  isInteracting: boolean | undefined,
): number {
  const effectiveRevealed = isInteracting ? Math.min(1, total) : revealed;
  return Math.min(effectiveRevealed, total);
}

/**
 * How many of `seriesId`'s batches are revealed, capped at its total batch
 * count. Clamped to the first batch while interacting.
 */
export const selectorProgressiveSeriesRevealedBatches = createSelector(
  selectorProgressiveAggregate,
  selectorProgressiveRevealedRounds,
  selectorChartZoomIsInteracting,
  function selectorProgressiveSeriesRevealedBatches(
    agg,
    revealed,
    isInteracting,
    seriesId: SeriesId,
  ) {
    const total = agg.nBatchesBySeries.get(seriesId) ?? 0;
    return getRevealedBatchCount(total, revealed, isInteracting);
  },
);

/**
 * Whether `seriesIds` render progressively:
 * - `svg-single`/`svg-batch`: never.
 * - `svg-progressive`: always.
 * - unset (auto): only when the experimental feature is on and total points
 *   exceed {@link PROGRESSIVE_POINT_THRESHOLD}.
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
