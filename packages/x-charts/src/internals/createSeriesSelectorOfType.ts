import { fastArrayCompare } from '@mui/x-internals/fastArrayCompare';
import { warnOnce } from '@mui/x-internals/warning';
import { ChartSeriesDefaultized, ChartsSeriesConfig } from '../models/seriesType/config';
import { SeriesId } from '../models/seriesType/common';
import { createSelector } from './plugins/utils/selectors';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { useStore } from './store/useStore';
import { useSelector } from './store/useSelector';

export function createSeriesSelectorsOfType<T extends keyof ChartsSeriesConfig>(seriesType: T) {
  const selectorSeriesWithIds = createSelector(
    [selectorChartSeriesProcessed, (_, ids?: SeriesId | SeriesId[]) => ids],
    (processedSeries, ids) => {
      if (!ids || (Array.isArray(ids) && ids.length === 0)) {
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
          `MUI X: The following ids provided to "${fnName}" could not be found: ${formattedIds}.`,
          `Make sure that they exist and their series are using the "${seriesType}" series type.`,
        ]);
      }
      return result;
    },
  );

  return (ids?: SeriesId | SeriesId[]) => {
    const store = useStore();

    return useSelector(store, selectorSeriesWithIds, ids, fastArrayCompare);
  };
}

export function createAllSeriesSelectorOfType<T extends keyof ChartsSeriesConfig>(seriesType: T) {
  const selectorSeries = createSelector(
    selectorChartSeriesProcessed,
    (processedSeries) => processedSeries[seriesType],
  );

  return () => {
    const store = useStore();

    return useSelector(store, selectorSeries);
  };
}
