import type {
  AllSeriesType,
  HighlightItemIdentifier,
  HighlightItemIdentifierWithType,
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
} from '../../../../models/seriesType';
import { type ChartsColorPalette } from '../../../../colorPalettes';
import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesType, type DatasetType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import {
  type SeriesLayoutGetterResult,
  type SeriesProcessorParams,
  type SeriesProcessorResult,
  type UseChartSeriesConfigSignature,
} from '../useChartSeriesConfig';
import {
  type VisibilityIdentifier,
  type VisibilityIdentifierWithType,
} from '../../featurePlugins/useChartVisibilityManager/useChartVisibilityManager.types';

export interface UseChartSeriesParameters<T extends ChartSeriesType = ChartSeriesType> {
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series?: Readonly<AllSeriesType<T>[]>;
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors?: ChartsColorPalette;
  theme?: 'light' | 'dark';
}

export type UseChartSeriesDefaultizedParameters<T extends ChartSeriesType = ChartSeriesType> =
  UseChartSeriesParameters<T> & {
    /**
     * The array of series to display.
     * Each type of series has its own specificity.
     * Please refer to the appropriate docs page to learn more about it.
     */
    series: Readonly<AllSeriesType<T>[]>;
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: ChartsColorPalette;
    theme: 'light' | 'dark';
  };

export type ProcessedSeries<TSeriesTypes extends ChartSeriesType = ChartSeriesType> = {
  [type in TSeriesTypes]?: SeriesProcessorResult<type>;
};

export type SeriesLayout<TSeriesTypes extends ChartSeriesType = ChartSeriesType> = {
  [type in TSeriesTypes]?: SeriesLayoutGetterResult<type>;
};

export type DefaultizedSeriesGroups<TSeriesTypes extends ChartSeriesType = ChartSeriesType> = {
  [type in TSeriesTypes]?: SeriesProcessorParams<type>;
};

export type SeriesIdToType = ReadonlyMap<SeriesId, ChartSeriesType>;

export interface UseChartSeriesState<T extends ChartSeriesType = ChartSeriesType> {
  series: {
    defaultizedSeries: DefaultizedSeriesGroups<T>;
    idToType: SeriesIdToType;
    dataset?: Readonly<DatasetType>;
  };
}

export type IdentifierWithTypeFunction = {
  // Overloads for different identifier types
  <SeriesType extends ChartSeriesType, Item extends SeriesItemIdentifier<SeriesType>>(
    identifier: Item,
    typeOfIdentifier?: 'seriesItem',
  ): SeriesItemIdentifierWithType<SeriesType>;

  <SeriesType extends ChartSeriesType, Item extends HighlightItemIdentifier<SeriesType>>(
    identifier: Item,
    typeOfIdentifier?: 'highlightItem',
  ): HighlightItemIdentifierWithType<SeriesType>;

  <SeriesType extends ChartSeriesType, Item extends VisibilityIdentifier<SeriesType>>(
    identifier: Item,
    typeOfIdentifier?: 'visibility',
  ): VisibilityIdentifierWithType<SeriesType>;
};

interface UseChartSeriesInstance {
  /**
   * Utils top add series type when developers do not provide it.
   * @param {Pick<SeriesItemIdentifier<SeriesType>, 'seriesId'>} identifier The series identifier without its type
   * @returns {Pick<SeriesItemIdentifier<SeriesType>, 'seriesId'> & Pick<SeriesItemIdentifier<SeriesType>, 'type'>}The identifier with the type.
   */
  identifierWithType: IdentifierWithTypeFunction;
}

export type UseChartSeriesSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesParameters;
    defaultizedParams: UseChartSeriesDefaultizedParameters<SeriesType>;
    state: UseChartSeriesState<SeriesType>;
    instance: UseChartSeriesInstance;
    dependencies: [UseChartSeriesConfigSignature<SeriesType>];
  }>;
