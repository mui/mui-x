'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { ChartPlugin } from '../../models';
import type { SeriesId } from '../../../../models/seriesType/common';
import type { UseProgressiveRenderingSignature } from './useProgressiveRendering.types';
import {
  sameSeriesIds,
  selectorProgressivePlans,
  selectorProgressiveTotalRounds,
  selectorShouldUseProgressiveRenderer,
} from './useProgressiveRendering.selectors';
import type { RendererType } from '../../../../ScatterChart';

const EMPTY_PLANS: ReadonlyMap<string, readonly SeriesId[]> = new Map();

/**
 * How many *rounds* are revealed per reveal tick once the render data is ready.
 * A round reveals one batch in every series simultaneously, so the chart looks
 * complete from the first paint rather than appearing series-by-series. Lower
 * spreads the paint over more ticks (smoother, more visibly progressive);
 * higher finishes sooner.
 */
const REVEAL_ROUNDS_PER_FRAME = 1;

/**
 * How many animation frames are skipped between two reveal ticks. `0` reveals
 * on every frame; `1` reveals every other frame, leaving the browser an idle
 * frame for layout, paint and input handling between commits. Higher values
 * give the browser more CPU headroom at the cost of a slower paint.
 */
const REVEAL_FRAMES_SKIPPED = 0;

/**
 * Chart-wide progressive rendering coordinator.
 *
 * Lives on the chart store, so every renderer composed into the same chart
 * (e.g. several `ScatterPlot` instances under one `ChartsContainer`) shares
 * the same scheduler. Each renderer registers a plan via
 * `setProgressivePlan(plotId, plan)`; the plugin aggregates them, computes a
 * single per-tick budget, and ramps a global "rounds" counter — one round
 * adds one batch in every registered series at once.
 */
export const useProgressiveRendering: ChartPlugin<UseProgressiveRenderingSignature> = ({
  store,
}) => {
  const registerProgressivePlan = useEventCallback(
    (
      plotId: string,
      seriesIds: readonly SeriesId[],
      renderer: RendererType | 'svg-progressive' | undefined,
    ) => {
      if (!selectorShouldUseProgressiveRenderer(store.state, seriesIds, renderer)) {
        return undefined;
      }

      const current = store.state.progressiveRendering.plans.get(plotId);
      if (!sameSeriesIds(current, seriesIds)) {
        const nextPlans = new Map(store.state.progressiveRendering.plans);
        nextPlans.set(plotId, seriesIds);
        // A real plan change restarts the progressive paint.
        store.set('progressiveRendering', { plans: nextPlans, revealedRounds: 0 });
      }
      return () => {
        if (!store.state.progressiveRendering.plans.has(plotId)) {
          return;
        }
        const nextPlans = new Map(store.state.progressiveRendering.plans);
        nextPlans.delete(plotId);
        store.set('progressiveRendering', {
          ...store.state.progressiveRendering,
          plans: nextPlans,
        });
      };
    },
  );

  const plans = store.use(selectorProgressivePlans) ?? EMPTY_PLANS;

  React.useEffect(() => {
    const startTotal = selectorProgressiveTotalRounds(store.state);
    if (startTotal === 0) {
      return undefined;
    }
    if (typeof requestAnimationFrame !== 'function') {
      store.set('progressiveRendering', {
        ...store.state.progressiveRendering,
        revealedRounds: startTotal,
      });
      return undefined;
    }

    let frame = 0;
    let cancelled = false;
    // Tracked in a closure variable, not derived inside a state updater (those
    // must be pure and StrictMode double-invokes them, which would schedule
    // the animation-frame chain twice).
    let revealed = 0;

    function scheduleNext() {
      let remaining = REVEAL_FRAMES_SKIPPED;
      const tick = () => {
        if (cancelled) {
          return;
        }
        if (remaining > 0) {
          remaining -= 1;
          frame = requestAnimationFrame(tick);
          return;
        }
        step();
      };
      frame = requestAnimationFrame(tick);
    }

    function step() {
      if (cancelled) {
        return;
      }
      const total = selectorProgressiveTotalRounds(store.state);
      revealed = Math.min(total, revealed + REVEAL_ROUNDS_PER_FRAME);
      store.set('progressiveRendering', {
        ...store.state.progressiveRendering,
        revealedRounds: revealed,
      });
      if (revealed < total) {
        scheduleNext();
      }
    }

    frame = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [plans, store]);

  return { instance: { registerProgressivePlan } };
};

useProgressiveRendering.params = {};

useProgressiveRendering.getInitialState = () => ({
  progressiveRendering: { plans: EMPTY_PLANS, revealedRounds: 0 },
});
