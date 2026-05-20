'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { type ChartPlugin } from '../../models';
import {
  SCATTER_REVEAL_FRAMES_SKIPPED,
  SCATTER_REVEAL_ROUNDS_PER_FRAME,
} from '../../../../ScatterChart/async/scatterRendererConstants';
import {
  type ProgressivePlanEntry,
  type UseProgressiveRenderingSignature,
} from './useProgressiveRendering.types';
import {
  sameProgressivePlan,
  selectorProgressivePlans,
  selectorProgressiveTotalRounds,
} from './useProgressiveRendering.selectors';

const EMPTY_PLANS: ReadonlyMap<string, readonly ProgressivePlanEntry[]> = new Map();

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
  const setProgressivePlan = useEventCallback(
    (plotId: string, plan: readonly ProgressivePlanEntry[]) => {
      const current = store.state.progressiveRendering.plans.get(plotId);
      if (sameProgressivePlan(current, plan)) {
        return;
      }
      const nextPlans = new Map(store.state.progressiveRendering.plans);
      nextPlans.set(plotId, plan);
      // A real plan change restarts the progressive paint.
      store.set('progressiveRendering', { plans: nextPlans, revealedRounds: 0 });
    },
  );

  const clearProgressivePlan = useEventCallback((plotId: string) => {
    if (!store.state.progressiveRendering.plans.has(plotId)) {
      return;
    }
    const nextPlans = new Map(store.state.progressiveRendering.plans);
    nextPlans.delete(plotId);
    store.set('progressiveRendering', {
      ...store.state.progressiveRendering,
      plans: nextPlans,
    });
  });

  // Drive the rAF scheduler. Re-runs only when the registered plans change
  // (Map identity changes only via the setters above, which already gate on
  // structural equality), so unrelated re-renders don't restart the paint.
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
      let remaining = SCATTER_REVEAL_FRAMES_SKIPPED;
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
      revealed = Math.min(total, revealed + SCATTER_REVEAL_ROUNDS_PER_FRAME);
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

  return { instance: { setProgressivePlan, clearProgressivePlan } };
};

useProgressiveRendering.params = {};

useProgressiveRendering.getInitialState = () => ({
  progressiveRendering: { plans: EMPTY_PLANS, revealedRounds: 0 },
});
