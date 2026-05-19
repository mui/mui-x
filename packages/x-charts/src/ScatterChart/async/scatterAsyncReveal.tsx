'use client';
import * as React from 'react';
import { type SeriesId } from '../../models/seriesType/common';
import {
  SCATTER_REVEAL_BATCHES_PER_FRAME,
  SCATTER_REVEAL_FRAMES_SKIPPED,
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
   * Number of batches revealed so far, counted globally across every series in
   * order. A single scheduler advances this, so the per-frame work is bounded
   * regardless of how many series there are.
   */
  revealedGlobalBatches: number;
  // Cumulative batch offset of `seriesId` (sum of preceding series' batches).
  getSeriesBatchOffset: (seriesId: SeriesId) => number;
}

const DEFAULT_VALUE: ScatterRevealContextValue = {
  // No provider (e.g. used directly as a slot): reveal everything.
  revealedGlobalBatches: Number.POSITIVE_INFINITY,
  getSeriesBatchOffset: () => 0,
};

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
 * Instead of each series running its own animation-frame loop (which would
 * reveal N batches per frame for N series and saturate the CPU), one loop
 * advances a global batch budget: one batch — across all series combined — per
 * reveal tick, with a frame skipped between ticks to leave the browser CPU
 * time. The paint replays whenever any series' `data` reference changes.
 */
export function ScatterAsyncRevealProvider(props: ScatterAsyncRevealProviderProps) {
  const { plan, children } = props;

  const totalBatches = plan.reduce((sum, entry) => sum + entry.nBatches, 0);

  // Offsets/total are recomputed every render (cheap — a handful of series)
  // but read through refs so neither the reveal effect nor the context value
  // churn on unrelated re-renders.
  const offsets = new Map<SeriesId, number>();
  let acc = 0;
  for (const entry of plan) {
    offsets.set(entry.seriesId, acc);
    acc += entry.nBatches;
  }
  const offsetsRef = React.useRef(offsets);
  offsetsRef.current = offsets;
  const totalBatchesRef = React.useRef(totalBatches);
  totalBatchesRef.current = totalBatches;

  const [revealedGlobalBatches, setRevealedGlobalBatches] = React.useState(0);

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
    setRevealedGlobalBatches(0);
    setResetToken((token) => token + 1);
  }

  React.useEffect(() => {
    setRevealedGlobalBatches(0);

    const total = totalBatchesRef.current;
    if (total === 0) {
      return undefined;
    }

    if (typeof requestAnimationFrame !== 'function') {
      setRevealedGlobalBatches(total);
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
      revealed = Math.min(total, revealed + SCATTER_REVEAL_BATCHES_PER_FRAME);
      setRevealedGlobalBatches(revealed);
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
      revealedGlobalBatches,
      getSeriesBatchOffset: (seriesId: SeriesId) => offsetsRef.current.get(seriesId) ?? 0,
    }),
    [revealedGlobalBatches],
  );

  return <ScatterRevealContext.Provider value={value}>{children}</ScatterRevealContext.Provider>;
}
