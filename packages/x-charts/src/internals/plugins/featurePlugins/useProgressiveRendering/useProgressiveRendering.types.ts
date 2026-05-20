import { type SeriesId } from '../../../../models/seriesType/common';
import { type ChartPluginSignature } from '../../models';

/**
 * One entry per (non-hidden) series that participates in the progressive
 * paint. `dataRef` is the series' `data` reference and is used to detect a
 * real data change (so unrelated re-renders don't replay the paint).
 */
export interface ProgressivePlanEntry {
  seriesId: SeriesId;
  /** Number of points in this series. */
  nPoints: number;
  /** Reference to the source data array, used for change detection. */
  dataRef: unknown;
}

export interface UseProgressiveRenderingState {
  progressiveRendering: {
    /**
     * Per-plot plans, keyed by an opaque plot id. Each plot (e.g. a separate
     * `ScatterPlot` composed into the same chart) registers its own plan.
     * The scheduler aggregates them into a single global progression.
     */
    plans: ReadonlyMap<string, readonly ProgressivePlanEntry[]>;
    /**
     * Number of *rounds* revealed so far. A round adds one batch in every
     * registered series simultaneously, so every series progresses together.
     */
    revealedRounds: number;
  };
}

export interface UseProgressiveRenderingInstance {
  /**
   * Register (or replace) the progressive plan for `plotId`. A no-op when the
   * supplied plan is structurally identical to the previous one, so it is
   * safe to call on every render.
   */
  setProgressivePlan(plotId: string, plan: readonly ProgressivePlanEntry[]): void;
  /** Remove the plan registered for `plotId` (e.g. on unmount). */
  clearProgressivePlan(plotId: string): void;
}

export type UseProgressiveRenderingSignature = ChartPluginSignature<{
  state: UseProgressiveRenderingState;
  instance: UseProgressiveRenderingInstance;
}>;
