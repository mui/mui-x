import * as React from 'react';
import { AllSeriesType } from '../models/seriesType';

type SeriesContextProviderProps = {
  series: AllSeriesType[];
  children: React.ReactNode;
};

type FormattedSeries = {
  [type in AllSeriesType['type']]?: { [id: string]: AllSeriesType['type'] };
};

const SeriesContext = React.createContext<FormattedSeries>({});

const seriesTypeFormatter: { [type in AllSeriesType['type']]?: (series: any) => any } = {
  bar: (x) => x,
};

const formatSeries = (series: AllSeriesType[]) => {
  const formattedSeries = {};
  series.forEach(({ id, type, ...other }) => {
    if (formattedSeries[type] === undefined) {
      formattedSeries[type] = {};
    }
    if (formatSeries[type]?.[id] !== undefined) {
      throw new Error(`MUI: series' id "${id}" is not unique`);
    }
    formattedSeries[type][id] = { id, type, ...other };
  });

  Object.keys(formatSeries).forEach((type) => {
    formattedSeries[type] =
      seriesTypeFormatter[type]?.(formattedSeries[type]) ?? formattedSeries[type];
  });
  return formattedSeries;
};

export function SeriesContextProvider({ series, children }: SeriesContextProviderProps) {
  const formattedSeries = React.useMemo(() => formatSeries(series), [series]);

  return <SeriesContext.Provider value={formattedSeries}>{children}</SeriesContext.Provider>;
}
