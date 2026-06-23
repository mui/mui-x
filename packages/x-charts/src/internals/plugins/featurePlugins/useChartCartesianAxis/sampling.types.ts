import type { SeriesId } from '../../../../models/seriesType/common';
import type { ChartSeriesType, ChartSeriesDefaultized } from '../../../../models/seriesType/config';
import type {
  ChartsXAxisProps,
  ChartsYAxisProps,
  ComputedAxis,
  ScaleName,
} from '../../../../models/axis';
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

/** Render-ready sampled bar (pixel-space rect) for one bucket. */
export interface SampledBar {
  /** Representative original index (today `bucket * bucketSize`). */
  dataIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Inputs the bar sampler needs to produce {@link SampledBar}s for one series. */
export interface BarSampleContext {
  /** Opaque built structure for this series (the strategy's `TBuilt`; the pyramid lives in pro). */
  built: unknown;
  series: ChartSeriesDefaultized<'bar'>;
  /** Zoom of the base band axis; `undefined` => the sampler returns `null`. */
  zoom: ZoomData | undefined;
  /** Pixel extent perpendicular to the value axis: `drawingArea.width` (vertical) else `.height`. */
  availableSize: number;
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  numberOfGroups: number;
  groupIndex: number;
}

/** Inputs the line sampler needs to produce the indices to render for one series. */
export interface LineSampleContext {
  built: unknown;
  zoom: ZoomData | undefined;
  /** `drawingArea.width`. */
  availableSize: number;
  algorithm: LineSamplingAlgorithm;
  /**
   * Lazy raw y channel; invoked by the sampler only for `lttb`.
   * @returns {ArrayLike<number>} The raw y values.
   */
  getValues: () => ArrayLike<number>;
}

/** Axis-level math inputs (no per-series built struct needed). */
export interface AxisSamplingContext {
  /** `axis.data.length`. */
  dataLength: number;
  /** Pixel extent along the band axis: width (x) / height (y). */
  availableSize: number;
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
   * Render-ready sampled bars for the current zoom, or `null` to fall back to the raw render.
   * @param {BarSampleContext} context The bar sampling inputs.
   * @returns {SampledBar[] | null} The bars to draw, or `null`.
   */
  sampleBars?: (context: BarSampleContext) => SampledBar[] | null;
  /**
   * Ascending original indices to draw for the current zoom, or `null` for the full render.
   * @param {LineSampleContext} context The line sampling inputs.
   * @returns {Int32Array | null} The indices to draw, or `null`.
   */
  sampleLineIndices?: (context: LineSampleContext) => Int32Array | null;
  /**
   * Merged bucket size at the given zoom span (`>= 1`; `1` = no merge), for axis-highlight widening.
   * @param {number} span The zoom span (`end - start`).
   * @param {AxisSamplingContext} context The axis sampling inputs.
   * @returns {number} The bucket size.
   */
  bucketSizeAt?: (span: number, context: AxisSamplingContext) => number;
  /**
   * Sampling-derived min zoom span for an axis, or `null` to leave `minSpan` untouched.
   * @param {AxisSamplingContext} context The axis sampling inputs.
   * @returns {number | null} The min span, or `null`.
   */
  minSpanFor?: (context: AxisSamplingContext) => number | null;
}
