import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesConfig } from './types/seriesConfig.types';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import {
  type HighlightItemIdentifierWithType,
  type SeriesItemIdentifierWithType,
} from '../../../../models/seriesType';
import { type VisibilityIdentifierWithType } from '../../featurePlugins/useChartVisibilityManager';

export interface UseChartSeriesConfigParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> {
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig?: ChartSeriesConfig<SeriesType>;
}

export type UseChartSeriesConfigDefaultizedParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = UseChartSeriesConfigParameters<SeriesType> & {
  seriesConfig: ChartSeriesConfig<SeriesType>;
};

export interface UseChartSeriesConfigState<SeriesType extends ChartSeriesType = ChartSeriesType> {
  seriesConfig: {
    config: ChartSeriesConfig<SeriesType>;
  };
}

export type SerializeIdentifierFunction = <T extends { type: ChartSeriesType }>(
  identifier: T,
) => string;

export type CleanIdentifierFunction = {
  // Overloads for different identifier types
  <SeriesType extends ChartSeriesType, Item extends SeriesItemIdentifierWithType<SeriesType>>(
    identifier: Item,
    typeOfIdentifier: 'seriesItem',
  ): Item;

  <SeriesType extends ChartSeriesType, Item extends HighlightItemIdentifierWithType<SeriesType>>(
    identifier: Item,
    typeOfIdentifier: 'highlightItem',
  ): Item;

  <SeriesType extends ChartSeriesType, Item extends VisibilityIdentifierWithType<SeriesType>>(
    identifier: Item,
    typeOfIdentifier: 'visibility',
  ): Item;
};

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

export type UseChartSeriesConfigSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesConfigParameters<SeriesType>;
    defaultizedParams: UseChartSeriesConfigDefaultizedParameters<SeriesType>;
    state: UseChartSeriesConfigState<SeriesType>;
    instance: UseChartSeriesConfigInstance;
  }>;
