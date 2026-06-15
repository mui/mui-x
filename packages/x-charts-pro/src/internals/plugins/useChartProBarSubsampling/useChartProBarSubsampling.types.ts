import {
  type BarSubsamplingState,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

// No public parameters yet — subsampling is always on and not user-configurable.
export interface UseChartProBarSubsamplingParameters {}

export type UseChartProBarSubsamplingDefaultizedParameters = UseChartProBarSubsamplingParameters;

export interface UseChartProBarSubsamplingState {
  barSubsampling: BarSubsamplingState;
}

export type UseChartProBarSubsamplingSignature = ChartPluginSignature<{
  params: UseChartProBarSubsamplingParameters;
  defaultizedParams: UseChartProBarSubsamplingDefaultizedParameters;
  state: UseChartProBarSubsamplingState;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
