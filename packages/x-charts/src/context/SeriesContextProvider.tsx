import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import barSeriesFormatter from '../BarChart/formatter';
import scatterSeriesFormatter from '../ScatterChart/formatter';
import lineSeriesFormatter from '../LineChart/formatter';
import { AllSeriesType } from '../models/seriesType';
import { defaultizeColor } from '../internals/defaultizeColor';
import { ChartSeriesType, FormatterParams, FormatterResult } from '../models/seriesType/config';
import { ChartsColorPalette, blueberryTwilightPalette } from '../colorPalettes';

export type SeriesContextProviderProps = {
  series: AllSeriesType[];
  /**
   * Color palette used to colorize multiple series.
   */
  colors?: ChartsColorPalette;
  children: React.ReactNode;
};

export type FormattedSeries = { [type in ChartSeriesType]?: FormatterResult<type> };

export const SeriesContext = React.createContext<FormattedSeries>({});

const seriesTypeFormatter: { [type in ChartSeriesType]?: (series: any) => any } = {
  bar: barSeriesFormatter,
  scatter: scatterSeriesFormatter,
  line: lineSeriesFormatter,
};

const formatSeries = (series: AllSeriesType[], colors?: string[]) => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: FormatterParams<type> } = {};
  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } = seriesData;

    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = { series: {}, seriesOrder: [] };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI: series' id "${id}" is not unique`);
    }
    seriesGroups[type]!.series[id] = { id, ...defaultizeColor(seriesData, seriesIndex, colors) };
    seriesGroups[type]!.seriesOrder.push(id);
  });

  const formattedSeries: FormattedSeries = {};
  // Apply formater on a type group
  (Object.keys(seriesTypeFormatter) as ChartSeriesType[]).forEach((type) => {
    if (seriesGroups[type] !== undefined) {
      formattedSeries[type] = seriesTypeFormatter[type]?.(seriesGroups[type]) ?? seriesGroups[type];
    }
  });

  return formattedSeries;
};

export function SeriesContextProvider({
  series,
  colors = blueberryTwilightPalette,
  children,
}: SeriesContextProviderProps) {
  const theme = useTheme();

  const formattedSeries = React.useMemo(
    () => formatSeries(series, typeof colors === 'function' ? colors(theme.palette.mode) : colors),
    [series, colors, theme.palette.mode],
  );

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}
