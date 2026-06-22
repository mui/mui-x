import {
  type SamplingState,
  type SamplingMethod,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSamplingParameters {
  /**
   * Sampling method used to render large datasets when zoomed out.
   * - `'none'`: render every element (no sampling).
   * - `'minmax'`: keep the min and max per bucket.
   * - `'m4'`: pixel-accurate—keep the first, min, max, and last per bucket (line series).
   * - `'lttb'`: Largest-Triangle-Three-Buckets, preserves the visual shape (line series).
   *
   * Bar series sample with a min/max envelope for any value other than `'none'`.
   * @default 'none'
   */
  sampling?: SamplingMethod;
}

export interface UseChartProSamplingDefaultizedParameters {
  sampling: SamplingMethod;
}

export interface UseChartProSamplingState {
  sampling: SamplingState;
}

export type UseChartProSamplingSignature = ChartPluginSignature<{
  params: UseChartProSamplingParameters;
  defaultizedParams: UseChartProSamplingDefaultizedParameters;
  state: UseChartProSamplingState;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
