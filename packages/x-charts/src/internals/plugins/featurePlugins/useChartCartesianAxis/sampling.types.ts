import type { SeriesId } from '../../../../models/seriesType/common';
import type { ChartSeriesType, ChartSeriesDefaultized } from '../../../../models/seriesType/config';
import type { ZoomData } from './zoom.types';

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

/** Built sampling structures keyed by series id (type depends on each series' strategy). */
export type SampledSeriesLookup = Record<SeriesId, unknown>;

/**
 * One bucket of the active level of detail: the original-index range it covers plus the ascending
 * original indices to actually render for it. Line series flatten `indices` into a polyline; bar
 * series draw one merged rect spanning `[startIndex, endIndex]` from the envelope of `indices`.
 */
export interface SampledBucket {
  /** First original index covered by the bucket. */
  startIndex: number;
  /** Last original index covered by the bucket (inclusive). */
  endIndex: number;
  /** Ascending original indices to render for the bucket. */
  indices: Int32Array;
}

/**
 * Inputs the sampler needs to produce {@link SampledBucket}s for one series. Series-type-agnostic:
 * bar series omit `algorithm`/`getValues` (they always use a min/max envelope).
 */
export interface SampleContext {
  /** Opaque built structure for this series (the strategy's `TBuilt`; the pyramid lives in pro). */
  built: unknown;
  /** Zoom of the sampled axis; `undefined` => the sampler returns `null`. */
  zoom: ZoomData | undefined;
  /** Pixel extent along the sampled axis (band axis for bars, x-axis for lines). */
  availableSize: number;
  /** The axis zoom `minSpan` (deepest zoom); level 0 (`span ≈ minSpan`) renders raw. */
  minSpan: number;
  /** Line algorithm; omitted (min/max envelope) for bar series. */
  algorithm?: LineSamplingAlgorithm;
  /**
   * Lazy raw value channel; invoked by the sampler only for `lttb`.
   * @returns {ArrayLike<number>} The raw values.
   */
  getValues?: () => ArrayLike<number>;
}

/** Axis-level math inputs (no per-series built struct needed). */
export interface AxisSamplingContext {
  /** `axis.data.length`. */
  dataLength: number;
  /** Pixel extent along the band axis: width (x) / height (y). */
  availableSize: number;
  /** The axis zoom `minSpan` (deepest zoom). */
  minSpan: number;
}

/**
 * Per-series-type sampling strategy, registered in `ChartSeriesTypeConfig.sampler`. The strategy
 * owns both building the LOD structure and consuming it into render-ready output, so all sampling
 * algorithm code lives in the pro package; community plot hooks/selectors only call these methods
 * through the (pro-injected) `seriesConfig.sampler` reference.
 *
 * `TBuilt` is opaque to community (`unknown` at the registration site); the pro implementation
 * narrows it inside each method.
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
  /**
   * The active level of detail as buckets for the current zoom, or `null` to render raw.
   * Series-type-agnostic: bar and line both consume {@link SampledBucket}s.
   * @param {SampleContext} context The sampling inputs.
   * @returns {SampledBucket[] | null} The buckets to render, or `null`.
   */
  sample?: (context: SampleContext) => SampledBucket[] | null;
  /**
   * Merged bucket size at the given zoom span (`>= 1`; `1` = no merge), for axis-highlight widening.
   * @param {number} span The zoom span (`end - start`).
   * @param {AxisSamplingContext} context The axis sampling inputs.
   * @returns {number} The bucket size.
   */
  bucketSizeAt?: (span: number, context: AxisSamplingContext) => number;
}
