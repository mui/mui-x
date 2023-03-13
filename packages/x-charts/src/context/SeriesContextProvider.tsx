import * as React from 'react';
import barSeriesFormatter from '../BarChart/formatter';
import scatterSeriesFormatter from '../ScatterChart/formatter';

import { AllSeriesType } from '../models/seriesType';

type SeriesContextProviderProps = {
  series: AllSeriesType[];
  children: React.ReactNode;
};

export type FormattedSeries = {
  [serriesType in AllSeriesType['type']]?: {
    series: { [id: string]: AllSeriesType };
    seriesOrder: string[];
    /**
     * Only for stackable series (bars, lines)
     */
    stackingGroups?: string[][];
  };
};

export const SeriesContext = React.createContext<FormattedSeries>({});

const seriesTypeFormatter: { [type in AllSeriesType['type']]?: (series: any) => any } = {
  bar: barSeriesFormatter,
  scatter: scatterSeriesFormatter,
};

const formatSeries = (series: AllSeriesType[]) => {
  // Group series by type
  const formattedSeries = {};
  series.forEach(({ id, type, ...other }) => {
    if (formattedSeries[type] === undefined) {
      formattedSeries[type] = { series: {}, seriesOrder: [] };
    }
    if (formatSeries[type]?.[id] !== undefined) {
      throw new Error(`MUI: series' id "${id}" is not unique`);
    }
    formattedSeries[type].series[id] = { id, type, ...other };
    formattedSeries[type].seriesOrder.push(id);
  });

  // Apply formater on a type group
  Object.keys(seriesTypeFormatter).forEach((type) => {
    if (formattedSeries[type] !== undefined) {
      formattedSeries[type] =
        seriesTypeFormatter[type]?.(formattedSeries[type]) ?? formattedSeries[type];
    }
  });

  return formattedSeries;
};

export function SeriesContextProvider({ series, children }: SeriesContextProviderProps) {
  const formattedSeries = React.useMemo(() => formatSeries(series), [series]);

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}
