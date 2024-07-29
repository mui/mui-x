import * as React from 'react';
import { AllSeriesType } from '../../models/seriesType';
import {
  ChartSeriesType,
  DatasetType,
  FormatterParams,
  FormatterResult,
} from '../../models/seriesType/config';
import { ChartsColorPalette } from '../../colorPalettes';

export type SeriesFormatterType<T extends ChartSeriesType> = (
  series: AllSeriesType<T>[],
  colors: string[],
  dataset?: DatasetType,
) => { [type in T]?: FormatterResult<type> };

export type SeriesProviderProps<T extends ChartSeriesType = ChartSeriesType> = {
  dataset?: DatasetType;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: AllSeriesType<T>[];
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors?: ChartsColorPalette;
  /**
   * Preprocessors for each series types.
   */
  seriesFormatters: SeriesFormatterConfig<T>;
  children: React.ReactNode;
};

export type FormattedSeries = { [type in ChartSeriesType]?: FormatterResult<type> };

export type SeriesFormatterConfig<T extends ChartSeriesType = ChartSeriesType> = {
  // TODO replace the function type by Formatter<K>
  [K in T]?: (series: FormatterParams<K>, dataset?: DatasetType) => any;
};
