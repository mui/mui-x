'use client';
import * as React from 'react';
import { type SeriesId } from '../../models/seriesType/common';
import {
  SCATTER_BATCH_SIZE,
  SCATTER_REVEAL_FRAMES_SKIPPED,
  SCATTER_REVEAL_ROUNDS_PER_FRAME,
  getEffectiveScatterBatchSize,
} from './scatterRendererConstants';

/**
 * One ordered entry per (non-hidden) scatter series rendered by the async
 * renderer. `dataRef` is the series' `data` reference, used to detect a real
 * data change (reshuffle) and replay the progressive paint.
 */
export interface ScatterRevealSeries {
  seriesId: SeriesId;
  nBatches: number;
  dataRef: unknown;
}

interface ScatterRevealContextValue {
  /**
   * Number of *rounds* revealed so far. A round advances every series by one
   * batch simultaneously, so the chart looks complete from the first paint.
   */
  revealedRounds: number;
  /**
   * Per-series points revealed per tick (i.e. {@link SCATTER_BATCH_SIZE} split
   * evenly across the visible series). `ScatterAsync` uses it to size its
   * batches consistently with how the scheduler reveals them.
   */
  batchSize: number;
  // How many of `seriesId`'s own batches are revealed. Capped at that series'
  // total batch count, so series with fewer batches simply stop progressing
  // while longer series keep filling in.
  getSeriesRevealedBatches: (seriesId: SeriesId) => number;
}

const DEFAULT_VALUE: ScatterRevealContextValue = {
  // No provider (e.g. used directly as a slot): reveal everything.
  revealedRounds: Number.POSITIVE_INFINITY,
  batchSize: SCATTER_BATCH_SIZE,
  getSeriesRevealedBatches: () => Number.POSITIVE_INFINITY,
};

/**
 * Per-series batch counts and the maximum across the plan. One reveal "round"
 * adds one batch in every series with at least that many batches; the total
 * number of rounds is therefore `max(entry.nBatches)`.
 */
function buildRevealPlan(plan: ScatterRevealSeries[]) {
  const nBatchesBySeries = new Map<SeriesId, number>();
  let maxBatches = 0;
  for (const entry of plan) {
    nBatchesBySeries.set(entry.seriesId, entry.nBatches);
    maxBatches = Math.max(maxBatches, entry.nBatches);
  }
  return { nBatchesBySeries, totalRounds: maxBatches };
}

const ScatterRevealContext = React.createContext<ScatterRevealContextValue>(DEFAULT_VALUE);

export function useScatterReveal() {
  return React.useContext(ScatterRevealContext);
}

/**
 * Whether two plans are equivalent for reveal purposes: same series, in the
 * same order, with the same `data` references and batch counts. `ScatterPlot`
 * rebuilds a new `plan` array on every render, so identity comparison is
 * useless — only a real change here should restart the progressive paint.
 */
function samePlan(a: ScatterRevealSeries[], b: ScatterRevealSeries[]) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].seriesId !== b[i].seriesId ||
      a[i].dataRef !== b[i].dataRef ||
      a[i].nBatches !== b[i].nBatches
    ) {
      return false;
    }
  }
  return true;
}

export interface ScatterAsyncRevealProviderProps {
  /** Ordered list of series participating in the progressive paint. */
  plan: ScatterRevealSeries[];
  children: React.ReactNode;
}

/**
 * Owns the single reveal scheduler shared by every `ScatterAsync` of a plot.
 *
 * Instead of each series running its own animation-frame loop, one loop
 * advances a global "rounds" counter: each round reveals one more batch in
 * every series simultaneously, so the chart looks complete from the first
 * paint rather than appearing series by series. The paint replays whenever any
 * series' `data` reference changes.
 */
export function ScatterAsyncRevealProvider(props: ScatterAsyncRevealProviderProps) {
  const { plan, children } = props;

  // The reveal plan is recomputed every render (cheap — a handful of series)
  // but read through refs so neither the reveal effect nor the context value
  // churn on unrelated re-renders.
  const { nBatchesBySeries, totalRounds } = buildRevealPlan(plan);
  const batchSize = getEffectiveScatterBatchSize(plan.length);
  const nBatchesBySeriesRef = React.useRef(nBatchesBySeries);
  nBatchesBySeriesRef.current = nBatchesBySeries;
  const totalRoundsRef = React.useRef(totalRounds);
  totalRoundsRef.current = totalRounds;

  const [revealedRounds, setRevealedRounds] = React.useState(0);

  // `ScatterPlot` allocates a new `plan` array on every render, so the reveal
  // scheduler cannot key off its identity. Bump a token only when the plan
  // actually changes (different data references / batch counts). That token is
  // the single trigger that restarts the progressive paint, so unrelated
  // re-renders (e.g. clicking a page anchor) never replay it.
  const [resetToken, setResetToken] = React.useState(0);
  const previousPlanRef = React.useRef(plan);
  if (!samePlan(previousPlanRef.current, plan)) {
    previousPlanRef.current = plan;
    // Reset synchronously during render so new points are never committed all
    // at once for a frame before the effect resets.
    setRevealedRounds(0);
    setResetToken((token) => token + 1);
  }

  React.useEffect(() => {
    setRevealedRounds(0);

    const total = totalRoundsRef.current;
    if (total === 0) {
      return undefined;
    }

    if (typeof requestAnimationFrame !== 'function') {
      setRevealedRounds(total);
      return undefined;
    }

    let frame = 0;
    let cancelled = false;
    // The progression is tracked in this closure variable, not derived inside
    // a state updater: updater functions must be pure, and React double-invokes
    // them in StrictMode, which would schedule the animation-frame chain twice
    // and make the ramp accelerate exponentially.
    let revealed = 0;

    // Schedule `step` after skipping `SCATTER_REVEAL_FRAMES_SKIPPED` frames, so
    // the browser keeps idle frames for layout, paint and input handling
    // between commits. Function declarations are hoisted, so `step` and
    // `scheduleNext` can reference each other regardless of order.
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
      revealed = Math.min(total, revealed + SCATTER_REVEAL_ROUNDS_PER_FRAME);
      setRevealedRounds(revealed);
      if (revealed < total) {
        scheduleNext();
      }
    }

    frame = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // Only a genuine plan change (via `resetToken`) restarts the scheduler.
  }, [resetToken]);

  const value = React.useMemo<ScatterRevealContextValue>(
    () => ({
      revealedRounds,
      batchSize,
      getSeriesRevealedBatches: (seriesId: SeriesId) =>
        Math.min(revealedRounds, nBatchesBySeriesRef.current.get(seriesId) ?? 0),
    }),
    [revealedRounds, batchSize],
  );

  return <ScatterRevealContext.Provider value={value}>{children}</ScatterRevealContext.Provider>;
}
