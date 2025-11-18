import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartVisibleSeriesSignature } from './useChartVisibleSeries.types';
import { SeriesId } from '../../../../models/seriesType/common';

export const useChartVisibleSeries: ChartPlugin<UseChartVisibleSeriesSignature> = ({
  store,
  params,
}) => {
  const hideItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibleSeries.hiddenSeriesIds;
    if (currentHidden.has(seriesId)) {
      return; // Already hidden
    }

    const newHidden = new Set(currentHidden);
    newHidden.add(seriesId);
    store.set('visibleSeries', { hiddenSeriesIds: newHidden });

    params.onVisibleSeriesChange?.(Array.from(newHidden));
  });

  const showItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibleSeries.hiddenSeriesIds;
    if (!currentHidden.has(seriesId)) {
      return; // Already visible
    }

    const newHidden = new Set(currentHidden);
    newHidden.delete(seriesId);
    store.set('visibleSeries', { hiddenSeriesIds: newHidden });

    params.onVisibleSeriesChange?.(Array.from(newHidden));
  });

  const toggleItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibleSeries.hiddenSeriesIds;

    if (currentHidden.has(seriesId)) {
      showItem(seriesId);
    } else {
      hideItem(seriesId);
    }
  });

  const isItemVisible = useEventCallback((seriesId: SeriesId) => {
    return !store.getSnapshot().visibleSeries.hiddenSeriesIds.has(seriesId);
  });

  return {
    instance: {
      hideItem,
      showItem,
      toggleItem,
      isItemVisible,
    },
  };
};

useChartVisibleSeries.getInitialState = (params, state) => ({
  visibleSeries: {
    hiddenSeriesIds: new Set(
      Object.values(state.series.processedSeries).flatMap((seriesData) =>
        Object.values(seriesData.series)
          .filter((s) => s.hidden === true)
          .map((s) => s.id),
      ),
    ),
  },
});

useChartVisibleSeries.params = {
  onVisibleSeriesChange: true,
};
