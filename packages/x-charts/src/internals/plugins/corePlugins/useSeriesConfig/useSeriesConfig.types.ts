import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesConfig } from '../../models/seriesConfig';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseSeriesConfigParameters {
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig?: ChartSeriesConfig<any>;
}

export type UseSeriesConfigDefaultizedParameters = UseSeriesConfigParameters & {
  seriesConfig: ChartSeriesConfig<any>;
};

export interface UseSeriesConfigState<T extends ChartSeriesType = ChartSeriesType> {
  seriesConfig: {
    config: ChartSeriesConfig<T>;
  };
}

export type UseSeriesConfigSignature<T extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseSeriesConfigParameters;
    defaultizedParams: UseSeriesConfigDefaultizedParameters;
    state: UseSeriesConfigState<T>;
  }>;
