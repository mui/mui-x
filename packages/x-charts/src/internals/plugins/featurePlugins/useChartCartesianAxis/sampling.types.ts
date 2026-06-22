import type { SeriesId } from '../../../../models/seriesType/common';
import type { ChartSeriesType, ChartSeriesDefaultized } from '../../../../models/seriesType/config';

/**
 * Ephemeral view of one level of detail: `subarray` views into the pyramid buffers plus its
 * bucket size. Built on demand by {@link selectSamplingLevelByZoom}, never stored.
 * Bucket `j` covers indices `[j * bucketSize, min((j + 1) * bucketSize - 1, dataLength - 1)]`
 * and the `[min, max]` value envelope of that range (so spikes and troughs survive merging).
 */
export interface SamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Minimum value per bucket. */
  min: Float64Array;
  /** Maximum value per bucket. */
  max: Float64Array;
}

/**
 * Precomputed LOD pyramid for one series, stored as flat typed arrays (no per-level or per-bucket
 * objects). All levels are concatenated finest (`bucketSize 2`) to coarsest into `min`/`max`;
 * `offsets[i]..offsets[i + 1]` is level `i` (bucketSize `2 ** (i + 1)`). `offsets.length - 1` levels.
 */
export interface SamplingPyramid {
  dataLength: number;
  /** All levels' minimum values, concatenated finest to coarsest. */
  min: Float64Array;
  /** All levels' maximum values, same order. */
  max: Float64Array;
  /** Level start offsets into `min`/`max`; length `levelCount + 1`, last entry `=== min.length`. */
  offsets: Int32Array;
}

/** Line sampling algorithms. `m4` is pixel-accurate; `minmax` is its 2-point subset; `lttb` keeps shape. */
export type LineSamplingAlgorithm = 'm4' | 'minmax' | 'lttb';

/**
 * Sampling method for the `sampling` prop. `'none'` disables sampling (default).
 * Any other value enables it; for line series it also selects the algorithm
 * (bar series always use a min/max envelope and ignore the specific algorithm).
 */
export type SamplingMethod = 'none' | LineSamplingAlgorithm;

/** State slice set by the pro `useChartProSampling` plugin; absent in community. */
export interface SamplingState {
  enabled: boolean;
  /** Algorithm used for line series. @default 'm4' */
  lineAlgorithm: LineSamplingAlgorithm;
}

/** Bar pyramids keyed by series id. */
export type SamplingPyramidLookup = Record<SeriesId, SamplingPyramid>;

/** Built sampling structures keyed by series id (type depends on each series' strategy). */
export type SampledSeriesLookup = Record<SeriesId, unknown>;

/**
 * Per-series-type sampling strategy, registered in `ChartSeriesTypeConfig.sampler`. Builds a
 * sampled representation from the processed series; the type-specific plot hook consumes it.
 *
 * `TBuilt` is the strategy's structure (e.g. {@link SamplingPyramid} for the min/max LOD strategy
 * shared by bar and line). Strategies that can't merge across zoom levels (e.g. LTTB) build the
 * raw input they need and reduce on demand inside their plot hook.
 */
export interface SamplingStrategy<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TBuilt = unknown,
> {
  /**
   * Builds the sampled structure for one series.
   * @param {ChartSeriesDefaultized<SeriesType>} series The processed series to sample.
   * @returns {TBuilt | null} The built structure, or `null` when the series can't be sampled.
   */
  build: (series: ChartSeriesDefaultized<SeriesType>) => TBuilt | null;
}
