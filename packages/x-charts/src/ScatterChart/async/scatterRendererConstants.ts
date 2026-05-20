/**
 * Number of scatter points rendered per batch by the async `svg-single` renderer.
 * Each batch mounts its own `<g>` immediately; its children (the markers) are
 * rendered from a zero-copy view on the packed coordinates typed array.
 */
export const SCATTER_BATCH_SIZE = 10000;

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
