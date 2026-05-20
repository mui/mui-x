/**
 * Total number of scatter points revealed per tick by the async `svg-single`
 * renderer, across every series combined. The budget is split evenly between
 * the visible series — with `N` series, each one reveals
 * `floor(SCATTER_BATCH_SIZE / N)` more points per tick — so every series
 * progresses together rather than appearing one at a time.
 *
 * The browser repaints every already-painted circle on each commit, so total
 * wall time scales with the number of commits times the growing point count.
 * Larger budgets mean fewer commits (and a faster overall paint) at the cost
 * of more main-thread work per commit.
 */
export const SCATTER_BATCH_SIZE = 10000;

/**
 * Per-series points revealed per tick, derived from {@link SCATTER_BATCH_SIZE}
 * by splitting the budget evenly across the visible series.
 */
export const getEffectiveScatterBatchSize = (nSeries: number) =>
  Math.max(1, Math.floor(SCATTER_BATCH_SIZE / Math.max(1, nSeries)));

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
