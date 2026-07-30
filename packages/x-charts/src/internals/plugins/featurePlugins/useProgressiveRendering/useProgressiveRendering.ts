'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { ChartPlugin } from '../../models';
import type { SeriesId } from '../../../../models/seriesType/common';
import type { UseProgressiveRenderingSignature } from './useProgressiveRendering.types';
import {
  sameSeriesIds,
  selectorProgressivePlans,
  selectorProgressiveRevealedRounds,
  selectorProgressiveTotalRounds,
  selectorShouldUseProgressiveRenderer,
} from './useProgressiveRendering.selectors';
import { selectorChartZoomIsInteracting } from '../useChartCartesianAxis';
import type { RendererType } from '../../../../ScatterChart';

const EMPTY_PLANS: ReadonlyMap<string, readonly SeriesId[]> = new Map();

/** Rounds revealed per tick. One round adds a batch to every series at once. */
const REVEAL_ROUNDS_PER_FRAME = 1;

/** Frames skipped between reveal ticks. `0` = every frame; higher = more headroom. */
const REVEAL_FRAMES_SKIPPED = 0;

/** Rounds kept visible during a zoom/pan interaction (first level only). */
const INTERACTION_REVEALED_ROUNDS = 1;

/** Settle delay before the reveal resumes after an interaction ends (ms). */
const RESUME_AFTER_INTERACTION_DELAY = 200;

/**
 * Chart-wide progressive rendering coordinator. Lives on the store so every
 * renderer in the chart shares one scheduler: each registers a plan via
 * `registerProgressivePlan`, and the plugin ramps a global "rounds" counter,
 * one round adding a batch to every series at once.
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
  const isZoomInteracting = store.use(selectorChartZoomIsInteracting);

  React.useEffect(() => {
    const startTotal = selectorProgressiveTotalRounds(store.state);
    if (startTotal === 0) {
      return undefined;
    }

    // While interacting, keep only the first level and pause; resets the wave
    // so it restarts from the first level once the interaction ends.
    if (isZoomInteracting) {
      const target = Math.min(INTERACTION_REVEALED_ROUNDS, startTotal);
      if (selectorProgressiveRevealedRounds(store.state) !== target) {
        store.set('progressiveRendering', {
          ...store.state.progressiveRendering,
          revealedRounds: target,
        });
      }
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
    let resumeTimeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    // Resume from the rounds already revealed (keeps the first level on screen).
    // Closure var, not a state-updater derivation: StrictMode double-invokes
    // those, scheduling the frame chain twice.
    let revealed = selectorProgressiveRevealedRounds(store.state);

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

    if (revealed >= startTotal) {
      return undefined;
    }

    // `revealed > 0` means resuming after an interaction: wait the settle delay.
    // Initial paint (`revealed === 0`) starts immediately.
    if (revealed > 0) {
      resumeTimeout = setTimeout(() => {
        frame = requestAnimationFrame(step);
      }, RESUME_AFTER_INTERACTION_DELAY);
    } else {
      frame = requestAnimationFrame(step);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (resumeTimeout !== undefined) {
        clearTimeout(resumeTimeout);
      }
    };
  }, [plans, isZoomInteracting, store]);

  return { instance: { registerProgressivePlan } };
};

useProgressiveRendering.params = {};

useProgressiveRendering.getInitialState = () => ({
  progressiveRendering: { plans: EMPTY_PLANS, revealedRounds: 0 },
});
