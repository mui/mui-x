import { warnOnce } from '@mui/x-internals/warning';
import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type ChartSeriesDefaultized, type ChartsSeriesConfig } from '../models/seriesType/config';
import { type SeriesId } from '../models/seriesType/common';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import type { ProcessedSeries } from './plugins/corePlugins/useChartSeries';
import { useStore } from './store/useStore';

export const selectorAllSeriesOfType = createSelector(
  selectorChartSeriesProcessed,
  <T extends keyof ChartsSeriesConfig>(processedSeries: ProcessedSeries, seriesType: T) =>
    processedSeries[seriesType],
);

export const selectorSeriesOfType = createSelectorMemoized(
  selectorChartSeriesProcessed,
  <T extends keyof ChartsSeriesConfig>(
    processedSeries: ProcessedSeries,
    seriesType: T,
    ids?: SeriesId | SeriesId[],
  ) => {
    if (ids === undefined || (Array.isArray(ids) && ids.length === 0)) {
      return (
        processedSeries[seriesType]?.seriesOrder?.map(
          (seriesId) => processedSeries[seriesType]?.series[seriesId],
        ) ?? []
      );
    }

    if (!Array.isArray(ids)) {
      return processedSeries[seriesType]?.series?.[ids];
    }

    const result: ChartSeriesDefaultized<T>[] = [];
    const failedIds: SeriesId[] = [];
    for (const id of ids) {
      const series = processedSeries[seriesType]?.series?.[id];
      if (series) {
        result.push(series);
      } else {
        failedIds.push(id);
      }
    }
    if (process.env.NODE_ENV !== 'production' && failedIds.length > 0) {
      const formattedIds = failedIds.map((v) => JSON.stringify(v)).join(', ');
      const fnName = `use${seriesType.charAt(0).toUpperCase()}${seriesType.slice(1)}Series`;
      warnOnce([
        `MUI X Charts: The following ids provided to "${fnName}" could not be found: ${formattedIds}.`,
        `Make sure that they exist and their series are using the "${seriesType}" series type.`,
      ]);
    }
    return result;
  },
);

export const useAllSeriesOfType = <T extends keyof ChartsSeriesConfig>(seriesType: T) => {
  const store = useStore();
  return store.use(selectorAllSeriesOfType, seriesType) as ProcessedSeries[T];
};

export const useSeriesOfType = <T extends keyof ChartsSeriesConfig>(
  seriesType: T,
  seriesId?: SeriesId | SeriesId[],
) => {
  const store = useStore();
  return store.use(selectorSeriesOfType, seriesType, seriesId) as
    | ChartSeriesDefaultized<T>
    | ChartSeriesDefaultized<T>[]
    | undefined;
};
