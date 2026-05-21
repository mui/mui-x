import { type SeriesId } from '../../../../models/seriesType/common';
import type { RendererType } from '../../../../ScatterChart';
import { type ChartPluginSignature } from '../../models';

export interface UseProgressiveRenderingState {
  progressiveRendering: {
    /**
     * Per-plot sets of series ids that should be progressively revealed, keyed
     * by an opaque plot id. Each plot (e.g. a separate `ScatterPlot` composed
     * into the same chart) registers its own set. The scheduler aggregates
     * them and reads point counts straight from the processed series.
     */
    plans: ReadonlyMap<string, readonly SeriesId[]>;
    /**
     * Number of *rounds* revealed so far. A round adds one batch in every
     * registered series simultaneously, so every series progresses together.
     */
    revealedRounds: number;
  };
}

export interface UseProgressiveRenderingInstance {
  /**
   * Register the set of series ids that `plotId` wants progressively revealed,
   * and return a cleanup function that unregisters them. Designed to be called
   * from a `React.useEffect`: returning the unregister function makes the
   * effect's cleanup tear the registration down on unmount or before the next
   * call. Re-calling with the same `plotId` replaces the previous set; a no-op
   * when the set is unchanged.
   */
  registerProgressivePlan(
    plotId: string,
    seriesIds: readonly SeriesId[],
    renderer: RendererType | 'svg-progressive' | undefined,
  ): (() => void) | undefined;
}

export type UseProgressiveRenderingSignature = ChartPluginSignature<{
  state: UseProgressiveRenderingState;
  instance: UseProgressiveRenderingInstance;
}>;
