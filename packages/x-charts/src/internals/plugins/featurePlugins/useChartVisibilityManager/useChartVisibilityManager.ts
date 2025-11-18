import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { SeriesId } from '../../../../models/seriesType/common';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  const hideItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenSeriesIds;
    if (currentHidden.has(seriesId)) {
      return; // Already hidden
    }

    const newHidden = new Set(currentHidden);
    newHidden.add(seriesId);
    store.set('visibilityManager', { hiddenSeriesIds: newHidden });

    params.onVisibilityChange?.(Array.from(newHidden));
  });

  const showItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenSeriesIds;
    if (!currentHidden.has(seriesId)) {
      return; // Already visible
    }

    const newHidden = new Set(currentHidden);
    newHidden.delete(seriesId);
    store.set('visibilityManager', { hiddenSeriesIds: newHidden });

    params.onVisibilityChange?.(Array.from(newHidden));
  });

  const toggleItem = useEventCallback((seriesId: SeriesId) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenSeriesIds;

    if (currentHidden.has(seriesId)) {
      showItem(seriesId);
    } else {
      hideItem(seriesId);
    }
  });

  const isItemVisible = useEventCallback((seriesId: SeriesId) => {
    return !store.getSnapshot().visibilityManager.hiddenSeriesIds.has(seriesId);
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

useChartVisibilityManager.getInitialState = (params, state) => ({
  visibilityManager: {
    hiddenSeriesIds: new Set(
      Object.values(state.series.processedSeries).flatMap((seriesData) =>
        Object.values(seriesData.series)
          .filter((s) => s.hidden === true)
          .map((s) => s.id),
      ),
    ),
  },
});

useChartVisibilityManager.params = {
  onVisibilityChange: true,
};
