import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import {
  UseChartVisibilityManagerSignature,
  type VisibilityItemIdentifier,
} from './useChartVisibilityManager.types';
import { isSameIdentifier } from './isSameIdentifier';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  const hideItem = useEventCallback((identifier: VisibilityItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;
    if (
      currentHidden.some((currentIdentifier) => isSameIdentifier(currentIdentifier, identifier))
    ) {
      return; // Already hidden
    }

    const newHidden = [...currentHidden, identifier];
    store.set('visibilityManager', { hiddenIdentifiers: newHidden });

    params.onVisibilityChange?.(newHidden);
  });

  const showItem = useEventCallback((identifier: VisibilityItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;
    if (
      !currentHidden.some((currentIdentifier) => isSameIdentifier(currentIdentifier, identifier))
    ) {
      return; // Already visible
    }

    const newHidden = [
      ...currentHidden.filter(
        (currentIdentifier) => !isSameIdentifier(currentIdentifier, identifier),
      ),
    ];
    store.set('visibilityManager', { hiddenIdentifiers: newHidden });

    params.onVisibilityChange?.(newHidden);
  });

  const toggleItem = useEventCallback((identifier: VisibilityItemIdentifier) => {
    const currentHidden = store.getSnapshot().visibilityManager.hiddenIdentifiers;

    if (
      currentHidden.some((currentIdentifier) => isSameIdentifier(currentIdentifier, identifier))
    ) {
      showItem(identifier);
    } else {
      hideItem(identifier);
    }
  });

  return {
    instance: {
      hideItem,
      showItem,
      toggleItem,
    },
    publicAPI: {
      hideItem,
      showItem,
      toggleItem,
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
