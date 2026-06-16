import {
  type SubsamplingState,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSubsamplingParameters {
  /**
   * If `true`, elements too small to render individually are subsampled.
   * @default true
   */
  subsampling?: boolean;
}

export interface UseChartProSubsamplingDefaultizedParameters {
  subsampling: boolean;
}

export interface UseChartProSubsamplingState {
  subsampling: SubsamplingState;
}

export type UseChartProSubsamplingSignature = ChartPluginSignature<{
  params: UseChartProSubsamplingParameters;
  defaultizedParams: UseChartProSubsamplingDefaultizedParameters;
  state: UseChartProSubsamplingState;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
