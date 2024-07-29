import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { AllSeriesType } from '../models/seriesType';
import { defaultizeColor } from '../internals/defaultizeColor';
import {
  ChartSeriesType,
  DatasetType,
  FormatterParams,
  FormatterResult,
} from '../models/seriesType/config';
import { ChartsColorPalette, blueberryTwilightPalette } from '../colorPalettes';
import { Initializable } from './context.types';

export type SeriesFormatterType<T extends ChartSeriesType> = (
  series: AllSeriesType<T>[],
  colors: string[],
  dataset?: DatasetType,
) => { [type in T]?: FormatterResult<type> };

export type SeriesContextProviderProps<T extends ChartSeriesType = ChartSeriesType> = {
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

export const SeriesContext = React.createContext<Initializable<FormattedSeries>>({
  isInitialized: false,
  data: {},
});

if (process.env.NODE_ENV !== 'production') {
  SeriesContext.displayName = 'SeriesContext';
}

export type SeriesFormatterConfig<T extends ChartSeriesType = ChartSeriesType> = {
  // TODO replace the function type by Formatter<K>
  [K in T]?: (series: FormatterParams<K>, dataset?: DatasetType) => any;
};

/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by devs
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
const preprocessSeries = <T extends ChartSeriesType>(
  series: AllSeriesType<T>[],
  colors: string[],
  seriesFormatters: SeriesFormatterConfig<T>,
  dataset?: DatasetType,
) => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: FormatterParams<type> } = {};
  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } = seriesData;

    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = { series: {}, seriesOrder: [] };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI X: series' id "${id}" is not unique.`);
    }

    seriesGroups[type]!.series[id] = {
      id,
      ...defaultizeColor(seriesData, seriesIndex, colors),
    };
    seriesGroups[type]!.seriesOrder.push(id);
  });

  const formattedSeries: FormattedSeries = {};
  // Apply formatter on a type group
  (Object.keys(seriesFormatters) as T[]).forEach((type) => {
    const group = seriesGroups[type];
    if (group !== undefined) {
      formattedSeries[type] = seriesFormatters[type]?.(group, dataset) ?? seriesGroups[type];
    }
  });

  return formattedSeries;
};

function SeriesContextProvider<T extends ChartSeriesType>(props: SeriesContextProviderProps<T>) {
  const { series, dataset, colors = blueberryTwilightPalette, seriesFormatters, children } = props;

  const theme = useTheme();

  const formattedSeries = React.useMemo(
    () => ({
      isInitialized: true,
      data: preprocessSeries(
        series,
        typeof colors === 'function' ? colors(theme.palette.mode) : colors,
        seriesFormatters,
        dataset as DatasetType<number>,
      ),
    }),
    [series, colors, theme.palette.mode, seriesFormatters, dataset],
  );

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}

export { SeriesContextProvider };
