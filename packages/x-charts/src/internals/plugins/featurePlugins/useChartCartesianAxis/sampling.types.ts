import type { SeriesId } from '../../../../models/seriesType/common';
import type {
  ChartSeriesType,
  ChartSeriesDefaultized,
  ChartsSeriesConfig,
} from '../../../../models/seriesType/config';
import type { ZoomData } from './zoom.types';

/** Line sampling algorithms. `m4` pixel-accurate; `minmax` its 2-point subset; `lttb` keeps shape. */
export type LineSamplingAlgorithm = 'm4' | 'minmax' | 'lttb';

/** `sampling` prop method. `'none'` (default) disables; for lines it also picks the algorithm. */
export type SamplingMethod = 'none' | LineSamplingAlgorithm;

/** Bar `sampling` method. Bars always use a min/max envelope, so line-only algorithms are excluded. */
export type BarSamplingMethod = 'none' | 'minmax';

/**
 * Per-series-type `sampling` prop on `ChartsDataProviderPro`. Derived from each type's
 * `samplingMethod`, contributed by pro via the per-type series-config extensions (e.g.
 * `BarSeriesExtension`). Empty in community-only builds.
 */
export type SamplingConfig = {
  [K in keyof ChartsSeriesConfig as ChartsSeriesConfig[K] extends { samplingMethod: any }
    ? K
    : never]?: ChartsSeriesConfig[K] extends { samplingMethod: infer M } ? M : never;
};

/** State set by the pro `useChartProSampling` plugin; absent in community. */
export interface SamplingState {
  /** True when at least one series type is sampled. */
  enabled: boolean;
  /** Method per series type; absent/`'none'` = not sampled. */
  methods: Partial<Record<ChartSeriesType, SamplingMethod>>;
}

/** Built sampling structures keyed by series id (type depends on the strategy). */
export type SampledSeriesLookup = Record<SeriesId, unknown>;

/**
 * One bucket of the active level of detail: the index range it covers plus the indices to render.
 * Lines flatten `indices` into a polyline; bars draw one merged rect over `[startIndex, endIndex]`.
 */
export interface SampledBucket {
  /** First original index covered. */
  startIndex: number;
  /** Last original index covered (inclusive). */
  endIndex: number;
  /** Ascending original indices to render. */
  indices: Int32Array;
}

/** Sampler inputs for one series. Bars omit `algorithm`/`getValues` (min/max envelope). */
export interface SampleContext {
  /** Opaque built structure (the strategy's `TBuilt`; the pyramid lives in pro). */
  built: unknown;
  /** Zoom of the sampled axis; `undefined` => sampler returns `null`. */
  zoom: ZoomData | undefined;
  /** Pixel extent along the sampled axis (band axis for bars, x-axis for lines). */
  availableSize: number;
  /** Axis zoom `minSpan`; level 0 (`span ≈ minSpan`) renders raw. */
  minSpan: number;
  /** Line algorithm. Omitted for bars, which always use the default min/max envelope. */
  algorithm?: LineSamplingAlgorithm;
  /**
   * Lazy raw values, read only for `lttb`.
   * @returns {ArrayLike<number>} The raw values.
   */
  getValues?: () => ArrayLike<number>;
}

/** Axis-level math inputs (no per-series built struct). */
export interface AxisSamplingContext {
  /** `axis.data.length`. */
  dataLength: number;
  /** Pixel extent along the band axis: width (x) / height (y). */
  availableSize: number;
  /** Axis zoom `minSpan`. */
  minSpan: number;
}

/**
 * Per-series-type sampling strategy, registered on `seriesConfig.sampler`. Owns both building the
 * LOD structure and consuming it, so all algorithm code lives in pro; community calls through the
 * pro-injected reference. `TBuilt` is opaque to community; pro narrows it per method.
 */
export interface SamplingStrategy<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TBuilt = unknown,
> {
  /**
   * Build the sampled structure for one series.
   * @param {ChartSeriesDefaultized<SeriesType>} series The processed series.
   * @returns {TBuilt | null} The built structure, or `null` if it can't be sampled.
   */
  build: (series: ChartSeriesDefaultized<SeriesType>) => TBuilt | null;
  /**
   * Active level of detail as buckets for the current zoom.
   * @param {SampleContext} context The sampling inputs.
   * @returns {SampledBucket[] | null} The buckets, or `null` to render raw.
   */
  sample?: (context: SampleContext) => SampledBucket[] | null;
  /**
   * Merged bucket size at a zoom span (`>= 1`; `1` = no merge), for axis-highlight widening.
   * @param {number} span The zoom span (`end - start`).
   * @param {AxisSamplingContext} context The axis inputs.
   * @returns {number} The bucket size.
   */
  bucketSizeAt?: (span: number, context: AxisSamplingContext) => number;
}
