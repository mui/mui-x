import {
  type ChartPluginSignature,
  type ChartSampledIndicesComputer,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSamplingParameters {}

export type UseChartProSamplingDefaultizedParameters = UseChartProSamplingParameters;

export interface UseChartProSamplingState {
  sampling: {
    /**
     * Computes the render-only sampled indices for every series that sets a `sampling` method.
     */
    computeSampledIndices: ChartSampledIndicesComputer;
  };
}

export type UseChartProSamplingSignature = ChartPluginSignature<{
  params: UseChartProSamplingParameters;
  defaultizedParams: UseChartProSamplingDefaultizedParameters;
  state: UseChartProSamplingState;
  dependencies: [UseChartSeriesSignature];
}>;
