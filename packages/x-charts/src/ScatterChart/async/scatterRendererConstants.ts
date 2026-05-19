/**
 * Number of scatter points rendered per batch by the async `svg-single` renderer.
 * Each batch mounts its own `<g>` immediately; its children (the markers) are
 * rendered from a zero-copy view on the packed coordinates typed array.
 */
export const SCATTER_BATCH_SIZE = 1000;

/**
 * Total scatter point count (across visible series) above which `ScatterPlot`
 * switches the `svg-single` renderer to the async, batched implementation.
 * Below it, the original per-item `Scatter` renderer is used.
 */
export const SCATTER_ASYNC_THRESHOLD = 2000;

/**
 * How many batches are revealed per reveal tick once the render data is ready.
 * Reveal ticks happen every other animation frame (a frame is skipped between
 * commits to leave the browser CPU time for layout/paint/input). Lower spreads
 * the paint over more ticks (smoother, more visibly progressive); higher
 * finishes sooner. One batch at the default batch size paints ~1000 points.
 */
export const SCATTER_REVEAL_BATCHES_PER_FRAME = 1;
