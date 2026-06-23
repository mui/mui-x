import {
  type SamplingState,
  type SamplingConfig,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSamplingParameters {
  /**
   * Per-series-type sampling configuration used to render large datasets when zoomed out.
   * Each series type accepts only the methods valid for it:
   * - bar: `'none'` | `'minmax'`.
   * - line: `'none'` | `'minmax'` | `'m4'` | `'lttb'`.
   *
   * @example { line: 'lttb', bar: 'minmax' }
   * @default {}
   */
  sampling?: SamplingConfig;
}

export interface UseChartProSamplingDefaultizedParameters {
  sampling: SamplingConfig;
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
