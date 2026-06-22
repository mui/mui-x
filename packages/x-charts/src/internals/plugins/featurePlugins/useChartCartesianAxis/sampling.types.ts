import type { SeriesId } from '../../../../models/seriesType/common';
import type { ChartSeriesType, ChartSeriesDefaultized } from '../../../../models/seriesType/config';

/**
 * The active level of detail for the current zoom: the slice `[start, end)` of the pyramid's
 * `argMin`/`argMax` arrays plus its bucket size. Bucket `j` (`j` from `0`) covers indices
 * `[j * bucketSize, min((j + 1) * bucketSize - 1, dataLength - 1)]`.
 */
export interface ActiveSamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Start offset into `argMin`/`argMax`. */
  start: number;
  /** End offset (exclusive) into `argMin`/`argMax`. */
  end: number;
}

/**
 * Precomputed LOD pyramid for one series, shared by every chart type and sampling method.
 * Stored as flat typed arrays (no per-level or per-bucket objects): for each bucket it keeps the
 * original index of the minimum (`argMin`, over the low channel) and the maximum (`argMax`, over
 * the high channel). Consumers read the values back from their own series data by index.
 *
 * All levels are concatenated finest (`bucketSize 2`) to coarsest; `offsets[i]..offsets[i + 1]` is
 * level `i` (bucketSize `2 ** (i + 1)`), and there are `offsets.length - 1` levels.
 */
export interface SamplingPyramid {
  dataLength: number;
  /** Index of the per-bucket minimum (low channel), concatenated finest to coarsest. */
  argMin: Int32Array;
  /** Index of the per-bucket maximum (high channel), same order. */
  argMax: Int32Array;
  /** Level start offsets into `argMin`/`argMax`; length `levelCount + 1`. */
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
