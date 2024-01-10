import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import barSeriesFormatter from '../BarChart/formatter';
import scatterSeriesFormatter from '../ScatterChart/formatter';
import lineSeriesFormatter from '../LineChart/formatter';
import pieSeriesFormatter from '../PieChart/formatter';
import { AllSeriesType } from '../models/seriesType';
import { defaultizeColor } from '../internals/defaultizeColor';
import {
  ChartSeriesType,
  DatasetType,
  FormatterParams,
  FormatterResult,
} from '../models/seriesType/config';
import { ChartsColorPalette, blueberryTwilightPalette } from '../colorPalettes';

export type SeriesContextProviderProps = {
  dataset?: DatasetType;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: AllSeriesType[];
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors?: ChartsColorPalette;
  children: React.ReactNode;
};

export type FormattedSeries = { [type in ChartSeriesType]?: FormatterResult<type> };

export const SeriesContext = React.createContext<FormattedSeries>({});

const seriesTypeFormatter: {
  [type in ChartSeriesType]?: (series: any, dataset?: DatasetType) => any;
} = {
  bar: barSeriesFormatter,
  scatter: scatterSeriesFormatter,
  line: lineSeriesFormatter,
  pie: pieSeriesFormatter,
};

/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by devs
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
const formatSeries = (series: AllSeriesType[], colors: string[], dataset?: DatasetType) => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: FormatterParams<type> } = {};
  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } = seriesData;

    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = { series: {}, seriesOrder: [] };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI-X-Charts: series' id "${id}" is not unique`);
    }

    seriesGroups[type]!.series[id] = {
      id,
      ...defaultizeColor(seriesData, seriesIndex, colors),
    };
    seriesGroups[type]!.seriesOrder.push(id);
  });

  const formattedSeries: FormattedSeries = {};
  // Apply formater on a type group
  (Object.keys(seriesTypeFormatter) as ChartSeriesType[]).forEach((type) => {
    if (seriesGroups[type] !== undefined) {
      formattedSeries[type] =
        seriesTypeFormatter[type]?.(seriesGroups[type], dataset) ?? seriesGroups[type];
    }
  });

  return formattedSeries;
};

function SeriesContextProvider(props: SeriesContextProviderProps) {
  const { series, dataset, colors = blueberryTwilightPalette, children } = props;

  const theme = useTheme();

  const formattedSeries = React.useMemo(
    () =>
      formatSeries(
        series,
        typeof colors === 'function' ? colors(theme.palette.mode) : colors,
        dataset as DatasetType<number>,
      ),
    [series, colors, theme.palette.mode, dataset],
  );

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}

export { SeriesContextProvider };
