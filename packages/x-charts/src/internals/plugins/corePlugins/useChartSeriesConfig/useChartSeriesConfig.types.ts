import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesConfig } from './types/seriesConfig.types';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type SeriesItemIdentifierWithType } from '../../../../models/seriesType';

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

export type SerializeIdentifierFunction = <T extends { type: ChartSeriesType }>(
  identifier: T,
) => string;

export type CleanIdentifierFunction = <T extends { type: ChartSeriesType }>(
  identifier: T,
) => SeriesItemIdentifierWithType<T['type']>;

export interface UseChartSeriesConfigInstance {
  /**
   * Function to serialize a series item identifier into a unique string.
   *
   * @param identifier The identifier to serialize.
   * @returns A unique string representing the identifier.
   */
  serializeIdentifier: SerializeIdentifierFunction;
  /**
   * Function to clean a series item identifier, returning only the properties
   * relevant to the series type.
   *
   * @param identifier The partial identifier to clean.
   * @returns A cleaned identifier with only the relevant properties.
   */
  cleanIdentifier: CleanIdentifierFunction;
}

export type UseChartSeriesConfigSignature<T extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesConfigParameters<T>;
    defaultizedParams: UseChartSeriesConfigDefaultizedParameters<T>;
    state: UseChartSeriesConfigState<T>;
    instance: UseChartSeriesConfigInstance;
  }>;
