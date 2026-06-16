import {
  type BarSubsamplingState,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProBarSubsamplingParameters {
  /**
   * If `true`, bars too thin to render individually are subsampled.
   * @default true
   */
  subsampling?: boolean;
}

export interface UseChartProBarSubsamplingDefaultizedParameters {
  subsampling: boolean;
}

export interface UseChartProBarSubsamplingState {
  barSubsampling: BarSubsamplingState;
}

export type UseChartProBarSubsamplingSignature = ChartPluginSignature<{
  params: UseChartProBarSubsamplingParameters;
  defaultizedParams: UseChartProBarSubsamplingDefaultizedParameters;
  state: UseChartProBarSubsamplingState;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
