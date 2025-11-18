import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { SeriesItemIdentifier } from '../../../../models/seriesType';
import { isSameIdentifier } from './isSameIdentifier';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  const hideItem = useEventCallback((itemIdentifier: SeriesItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;
    if (
      currentHidden.some((currentIdentifier) => isSameIdentifier(currentIdentifier, itemIdentifier))
    ) {
      return; // Already hidden
    }

    const newHidden = [...currentHidden, itemIdentifier];
    store.set('visibilityManager', { hiddenIdentifiers: newHidden });

    params.onVisibilityChange?.(newHidden);
  });

  const showItem = useEventCallback((itemIdentifier: SeriesItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;
    if (
      !currentHidden.some((currentIdentifier) =>
        isSameIdentifier(currentIdentifier, itemIdentifier),
      )
    ) {
      return; // Already visible
    }

    const newHidden = [
      ...currentHidden.filter(
        (currentIdentifier) => !isSameIdentifier(currentIdentifier, itemIdentifier),
      ),
    ];
    store.set('visibilityManager', { hiddenIdentifiers: newHidden });

    params.onVisibilityChange?.(Array.from(newHidden));
  });

  const toggleItem = useEventCallback((itemIdentifier: SeriesItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;

    if (
      currentHidden.some((currentIdentifier) => isSameIdentifier(currentIdentifier, itemIdentifier))
    ) {
      showItem(itemIdentifier);
    } else {
      hideItem(itemIdentifier);
    }
  });

  const isItemVisible = useEventCallback((itemIdentifier: SeriesItemIdentifier) => {
    return !store
      .getSnapshot()
      .visibilityManager.hiddenIdentifiers.some((currentIdentifier) =>
        isSameIdentifier(currentIdentifier, itemIdentifier),
      );
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
    hiddenIdentifiers: Object.values(state.series.processedSeries).flatMap((seriesData) =>
      Object.values(seriesData.series)
        .filter((s) => s.hidden === true)
        .map((s) => s.id),
    ),
  },
});

useChartVisibilityManager.params = {
  onVisibilityChange: true,
};
