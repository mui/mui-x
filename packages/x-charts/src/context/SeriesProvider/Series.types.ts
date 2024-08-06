import * as React from 'react';
import { AllSeriesType } from '../../models/seriesType';
import { ChartSeriesType, DatasetType } from '../../models/seriesType/config';
import { ChartsColorPalette } from '../../colorPalettes';
import { SeriesFormatterResult } from '../PluginProvider';

export type SeriesFormatterType<T extends ChartSeriesType> = (
  series: AllSeriesType<T>[],
  colors: string[],
  dataset?: DatasetType,
) => { [type in T]?: SeriesFormatterResult<type> };

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
  children: React.ReactNode;
};

export type FormattedSeries = { [type in ChartSeriesType]?: SeriesFormatterResult<type> };
