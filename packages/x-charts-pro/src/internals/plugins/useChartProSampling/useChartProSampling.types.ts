import {
  type SamplingState,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSamplingParameters {
  /**
   * If `true`, elements too small to render individually are sampled.
   * @default true
   */
  sampling?: boolean;
}

export interface UseChartProSamplingDefaultizedParameters {
  sampling: boolean;
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
