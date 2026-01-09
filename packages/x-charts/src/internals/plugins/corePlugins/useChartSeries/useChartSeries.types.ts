import { type AllSeriesType } from '../../../../models/seriesType';
import { type ChartsColorPalette } from '../../../../colorPalettes';
import {
  type ChartPluginSignature,
  type ChartSeriesConfig,
  type SeriesLayoutGetterResult,
} from '../../models';
import { type ChartSeriesType, type DatasetType } from '../../../../models/seriesType/config';
import {
  type SeriesProcessorParams,
  type SeriesProcessorResult,
} from '../../models/seriesConfig/seriesProcessor.types';

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

export interface UseChartSeriesState<T extends ChartSeriesType = ChartSeriesType> {
  series: {
    defaultizedSeries: DefaultizedSeriesGroups<T>;
    seriesConfig: ChartSeriesConfig<T>;
    dataset?: Readonly<DatasetType>;
  };
}

export type SerializeIdentifierFunction = <T extends { type: ChartSeriesType }>(
  identifier: T,
) => string;

export interface UseChartSeriesInstance {
  /**
   * Function to serialize a series item identifier into a unique string.
   *
   * @param identifier The identifier to serialize.
   * @returns A unique string representing the identifier.
   */
  serializeIdentifier: SerializeIdentifierFunction;
}

export type UseChartSeriesSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesParameters;
    defaultizedParams: UseChartSeriesDefaultizedParameters<SeriesType>;
    state: UseChartSeriesState<SeriesType>;
    instance: UseChartSeriesInstance;
  }>;
