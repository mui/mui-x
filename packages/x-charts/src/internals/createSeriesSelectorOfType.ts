import { ChartsSeriesConfig } from '../models/seriesType/config';
import { SeriesId } from '../models/seriesType/common';
import { createSelector } from './plugins/utils/selectors';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { useStore } from './store/useStore';
import { useSelector } from './store/useSelector';

export function createSeriesSelectorsOfType<T extends keyof ChartsSeriesConfig>(seriesType: T) {
  const selectorSeriesWithIds = createSelector(
    [selectorChartSeriesProcessed, (_, ids: SeriesId[]) => ids],
    (processedSeries, ids) => {
      if (ids.length === 0) {
        return processedSeries[seriesType];
      }

      if (ids.length === 1) {
        return processedSeries[seriesType]?.series?.[ids[0]];
      }

      return ids.map((id) => processedSeries[seriesType]?.series?.[id]);
    },
  );

  return (ids?: SeriesId[]) => {
    const store = useStore();

    return useSelector(store, selectorSeriesWithIds, ids);
  };
}
