import { AllSeriesType } from '../../../../models/seriesType';
import { ChartsColorPalette } from '../../../../colorPalettes';
import { ChartPluginSignature, ChartSeriesConfig } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import { SeriesProcessorResult } from '../../models/seriesConfig/seriesProcessor.types';

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

export interface UseChartSeriesState<T extends ChartSeriesType = ChartSeriesType> {
  series: { processedSeries: ProcessedSeries<T>; seriesConfig: ChartSeriesConfig<T> };
}

export interface UseChartSeriesInstance {}

export type UseChartSeriesSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesParameters;
    defaultizedParams: UseChartSeriesDefaultizedParameters<SeriesType>;
    state: UseChartSeriesState<SeriesType>;
    instance: UseChartSeriesInstance;
  }>;
