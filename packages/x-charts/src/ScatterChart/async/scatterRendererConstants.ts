/**
 * Target number of reveal commits for the async `svg-single` renderer. Each
 * commit repaints every already-painted circle, so the total progressive wall
 * time is roughly `(C + 1) / 2` times the time of a single synchronous render
 * (where `C` is the number of commits). Targeting `5` commits keeps the
 * progressive paint at roughly 2–3× the synchronous render time.
 */
export const SCATTER_TARGET_PROGRESSIVE_COMMITS = 5;

/**
 * Lower bound for the per-tick reveal budget (total points across every
 * series). Prevents tiny commits whose React overhead would dominate.
 */
export const SCATTER_MIN_BATCH_TOTAL = 1000;

/**
 * Upper bound for the per-tick reveal budget (total points across every
 * series). Prevents a single commit from blocking the main thread for too
 * long; very large datasets simply use more commits.
 */
export const SCATTER_MAX_BATCH_TOTAL = 10000;

/**
 * Per-series points revealed per tick, derived from the total point count
 * across visible series and the number of visible series. The total per-tick
 * budget aims for {@link SCATTER_TARGET_PROGRESSIVE_COMMITS} commits to land
 * progressive paint at roughly 2–3× the synchronous render time, clamped by
 * {@link SCATTER_MIN_BATCH_TOTAL} / {@link SCATTER_MAX_BATCH_TOTAL}. The
 * resulting budget is then split evenly across the visible series so every
 * series progresses together.
 */
export const getEffectiveScatterBatchSize = (nSeries: number, totalPoints: number) => {
  const safeSeries = Math.max(1, nSeries);
  const safePoints = Math.max(1, totalPoints);
  const totalPerTick = Math.min(
    SCATTER_MAX_BATCH_TOTAL,
    Math.max(SCATTER_MIN_BATCH_TOTAL, Math.ceil(safePoints / SCATTER_TARGET_PROGRESSIVE_COMMITS)),
  );
  return Math.max(1, Math.floor(totalPerTick / safeSeries));
};

/**
 * Total scatter point count (across visible series) above which `ScatterPlot`
 * switches the `svg-single` renderer to the async, batched implementation.
 * Below it, the original per-item `Scatter` renderer is used.
 */
export const SCATTER_ASYNC_THRESHOLD = 20000;

/**
 * How many *rounds* are revealed per reveal tick once the render data is ready.
 * A round reveals one batch in every series simultaneously, so the chart looks
 * complete from the first paint rather than appearing series-by-series. Lower
 * spreads the paint over more ticks (smoother, more visibly progressive);
 * higher finishes sooner.
 */
export const SCATTER_REVEAL_ROUNDS_PER_FRAME = 1;

/**
 * How many animation frames are skipped between two reveal ticks. `0` reveals
 * on every frame; `1` reveals every other frame, leaving the browser
 * an idle frame for layout, paint and input handling between commits. Higher
 * values give the browser more CPU headroom at the cost of a slower paint.
 */
export const SCATTER_REVEAL_FRAMES_SKIPPED = 0;
