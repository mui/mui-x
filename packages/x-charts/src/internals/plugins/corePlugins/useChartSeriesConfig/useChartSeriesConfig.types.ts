import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesConfig } from '../../models/seriesConfig';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartSeriesConfigParameters<T extends ChartSeriesType = ChartSeriesType> {
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig?: ChartSeriesConfig<T>;
}

export type UseChartSeriesConfigDefaultizedParameters<T extends ChartSeriesType = ChartSeriesType> =
  UseChartSeriesConfigParameters<T> & {
    seriesConfig: ChartSeriesConfig<T>;
  };

export interface UseChartSeriesConfigState<T extends ChartSeriesType = ChartSeriesType> {
  seriesConfig: {
    config: ChartSeriesConfig<T>;
  };
}

export type UseChartSeriesConfigSignature<T extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesConfigParameters<T>;
    defaultizedParams: UseChartSeriesConfigDefaultizedParameters<T>;
    state: UseChartSeriesConfigState<T>;
  }>;
