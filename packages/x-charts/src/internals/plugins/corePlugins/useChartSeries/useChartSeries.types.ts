import { AllSeriesType } from '../../../../models/seriesType';
import { ChartsColorPalette } from '../../../../colorPalettes';
import { ChartPluginSignature } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import { SeriesProcessorResult } from '../../models/seriesConfig/seriesProcessor.types';

export interface UseChartSeriesParameters<T extends ChartSeriesType = ChartSeriesType> {
  dataset?: DatasetType;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series?: AllSeriesType<T>[];
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
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
    series?: AllSeriesType<T>[];
    /**
     * Color palette used to colorize multiple series.
     * @default blueberryTwilightPalette
     */
    colors: ChartsColorPalette;
    theme: 'light' | 'dark';
  };

export type ProcessedSeries<TSeriesTypes extends ChartSeriesType = ChartSeriesType> = {
  [type in TSeriesTypes]?: SeriesProcessorResult<type>;
};

export interface UseChartSeriesState {
  series: ProcessedSeries<ChartSeriesType>;
}

export interface UseChartSeriesInstance {}

export type UseChartSeriesSignature = ChartPluginSignature<{
  params: UseChartSeriesParameters;
  defaultizedParams: UseChartSeriesDefaultizedParameters;
  state: UseChartSeriesState;
  instance: UseChartSeriesInstance;
}>;
