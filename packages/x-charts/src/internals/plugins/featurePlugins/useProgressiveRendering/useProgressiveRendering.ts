'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { type ChartPlugin } from '../../models';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type UseProgressiveRenderingSignature } from './useProgressiveRendering.types';
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
 * Number of rounds kept visible during a zoom/pan interaction. Only the first
 * level is ever painted while interacting so the interaction stays fluid; the
 * remaining rounds resume once the interaction settles.
 */
const INTERACTION_REVEALED_ROUNDS = 1;

/**
 * How long the chart must stay free of zoom/pan interaction before the
 * progressive reveal of the remaining rounds resumes. The pro zoom plugin
 * already debounces the end of an interaction, so this only adds a small extra
 * settle window on top of that.
 */
const RESUME_AFTER_INTERACTION_DELAY = 200;

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
  const isZoomInteracting = store.use(selectorChartZoomIsInteracting);

  React.useEffect(() => {
    const startTotal = selectorProgressiveTotalRounds(store.state);
    if (startTotal === 0) {
      return undefined;
    }

    // While the user zooms/pans, keep only the first level revealed and pause
    // the reveal so the interaction stays fluid. Resetting here also restarts
    // the progressive wave from the first level once the interaction ends.
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
    // Resume from the rounds already revealed rather than restarting from zero,
    // so coming out of a zoom/pan keeps the first level on screen and only
    // fills in the rest. Tracked in a closure variable, not derived inside a
    // state updater (those must be pure and StrictMode double-invokes them,
    // which would schedule the animation-frame chain twice).
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

    // A partially revealed paint (`revealed > 0`) means we are resuming after a
    // zoom/pan reset, so wait out the inactivity delay before filling in the
    // rest. The initial paint (`revealed === 0`) starts immediately.
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
