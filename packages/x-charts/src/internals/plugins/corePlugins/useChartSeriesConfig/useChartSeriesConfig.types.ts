import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesConfig } from '../../models/seriesConfig';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartSeriesConfigParameters {
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig?: ChartSeriesConfig<any>;
}

export type UseChartSeriesConfigDefaultizedParameters = UseChartSeriesConfigParameters & {
  seriesConfig: ChartSeriesConfig<any>;
};

export interface UseChartSeriesConfigState<T extends ChartSeriesType = ChartSeriesType> {
  seriesConfig: {
    config: ChartSeriesConfig<T>;
  };
}

export type UseChartSeriesConfigSignature<T extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesConfigParameters;
    defaultizedParams: UseChartSeriesConfigDefaultizedParameters;
    state: UseChartSeriesConfigState<T>;
  }>;
