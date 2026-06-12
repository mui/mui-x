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
import { type AsyncStatus } from '../../utils/asyncResource';

export interface UseChartSeriesParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series?: Readonly<AllSeriesType<SeriesType>[]>;
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors?: ChartsColorPalette;
  theme?: 'light' | 'dark';
}

export type UseChartSeriesDefaultizedParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = UseChartSeriesParameters<SeriesType> & {
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: Readonly<AllSeriesType<SeriesType>[]>;
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: ChartsColorPalette;
  theme: 'light' | 'dark';
};

export type ProcessedSeries<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesProcessorResult<type>;
};

export type SeriesLayout<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesLayoutGetterResult<type>;
};

export type DefaultizedSeriesGroups<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesProcessorParams<type>;
};

export type SeriesIdToType = ReadonlyMap<SeriesId, ChartSeriesType>;

export interface UseChartSeriesState<SeriesType extends ChartSeriesType = ChartSeriesType> {
  series: {
    defaultizedSeries: DefaultizedSeriesGroups<SeriesType>;
    idToType: SeriesIdToType;
    dataset?: Readonly<DatasetType>;
    /**
     * Lifecycle status of the async series pipeline (load + defaultize).
     * Optional for backwards compatibility with state fixtures that pre-date
     * the async pipeline; absent is treated as 'success'.
     * - 'idle': no input
     * - 'pending': loader in flight
     * - 'success': last resolution committed
     * - 'error': last resolution rejected; consumer should surface the error
     */
    status?: AsyncStatus;
    /**
     * Set when `status === 'error'`. The plugin re-throws this from its body
     * so React error boundaries catch it.
     */
    error?: Error;
  };
}

export type IdentifierWithTypeFunction = {
  // Overloads for different identifier types
  <
    SeriesType extends ChartSeriesType,
    Item extends SeriesItemIdentifier<SeriesType> | SeriesItemIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'seriesItem',
  ): SeriesItemIdentifierWithType<SeriesType>;

  <
    SeriesType extends ChartSeriesType,
    Item extends HighlightItemIdentifier<SeriesType> | HighlightItemIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'highlightItem',
  ): HighlightItemIdentifierWithType<SeriesType>;

  <
    SeriesType extends ChartSeriesType,
    Item extends VisibilityIdentifier<SeriesType> | VisibilityIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'visibility',
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
