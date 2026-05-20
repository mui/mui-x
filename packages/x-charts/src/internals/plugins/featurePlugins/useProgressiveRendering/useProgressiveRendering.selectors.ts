import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import {
  SCATTER_MIN_BATCH_TOTAL,
  getEffectiveScatterBatchSize,
} from '../../../../ScatterChart/async/scatterRendererConstants';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import {
  type ProgressivePlanEntry,
  type UseProgressiveRenderingSignature,
} from './useProgressiveRendering.types';

const selectorProgressiveState: ChartOptionalRootSelector<UseProgressiveRenderingSignature> = (
  state,
) => state.progressiveRendering;

/** Map of registered plots → their plan. */
export const selectorProgressivePlans = createSelector(selectorProgressiveState, (s) => s?.plans);

/** Total number of rounds revealed across all plots so far. */
export const selectorProgressiveRevealedRounds = createSelector(
  selectorProgressiveState,
  (s) => s?.revealedRounds ?? 0,
);

/**
 * Aggregated view of every registered plan: the per-series batch counts, the
 * total number of rounds, and the per-series batch size (so every consumer
 * sizes its batches the same way).
 */
export const selectorProgressiveAggregate = createSelectorMemoized(
  selectorProgressivePlans,
  function selectorProgressiveAggregate(plans) {
    const nBatchesBySeries = new Map<SeriesId, number>();
    if (!plans || plans.size === 0) {
      return { nBatchesBySeries, totalRounds: 0, batchSize: SCATTER_MIN_BATCH_TOTAL };
    }

    let nSeries = 0;
    let totalPoints = 0;
    plans.forEach((plan) => {
      nSeries += plan.length;
      for (const entry of plan) {
        totalPoints += entry.nPoints;
      }
    });

    const batchSize = getEffectiveScatterBatchSize(nSeries, totalPoints);

    let totalRounds = 0;
    plans.forEach((plan) => {
      for (const entry of plan) {
        const n = Math.max(1, Math.ceil(entry.nPoints / batchSize));
        nBatchesBySeries.set(entry.seriesId, n);
        if (n > totalRounds) {
          totalRounds = n;
        }
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
 * Structural equality between two progressive plans: same series, in the same
 * order, with the same `data` references and the same point counts. Used by
 * `setProgressivePlan` to skip no-op updates.
 */
export function sameProgressivePlan(
  a: readonly ProgressivePlanEntry[] | undefined,
  b: readonly ProgressivePlanEntry[],
) {
  if (!a || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].seriesId !== b[i].seriesId ||
      a[i].dataRef !== b[i].dataRef ||
      a[i].nPoints !== b[i].nPoints
    ) {
      return false;
    }
  }
  return true;
}
