import {
  type ChartPluginSignature,
  type ChartSeriesSamplers,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export interface UseChartProSamplingParameters {}

export type UseChartProSamplingDefaultizedParameters = UseChartProSamplingParameters;

export interface UseChartProSamplingState {
  sampling: {
    /**
     * The samplers used to downsample series for rendering, keyed by series type.
     */
    samplers: ChartSeriesSamplers;
  };
}

export type UseChartProSamplingSignature = ChartPluginSignature<{
  params: UseChartProSamplingParameters;
  defaultizedParams: UseChartProSamplingDefaultizedParameters;
  state: UseChartProSamplingState;
  dependencies: [UseChartSeriesSignature];
}>;
