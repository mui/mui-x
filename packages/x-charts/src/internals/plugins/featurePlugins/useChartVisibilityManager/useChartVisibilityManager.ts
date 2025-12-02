import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  const hideItem = useEventCallback((identifier: string) => {
    const currentHidden = store.state.visibilityManager.visibilityMap;
    if (currentHidden[identifier]) {
      return; // Already hidden
    }

    const newVisibility = { ...currentHidden, [identifier]: true };
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibility,
    });

    params.onVisibilityChange?.(newVisibility);
  });

  const showItem = useEventCallback((identifier: string) => {
    const currentHidden = store.state.visibilityManager.visibilityMap;
    if (!currentHidden[identifier]) {
      return; // Already visible
    }

    const newVisibility = { ...currentHidden, [identifier]: false };
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibility,
    });

    params.onVisibilityChange?.(newVisibility);
  });

  const toggleItem = useEventCallback((identifier: string) => {
    const currentHidden = store.state.visibilityManager.visibilityMap;

    if (currentHidden[identifier]) {
      showItem(identifier);
    } else {
      hideItem(identifier);
    }
  });

  const getIdentifier = useEventCallback((ids: (string | number)[]) => {
    return ids.join(store.state.visibilityManager.separator);
  });

  return {
    instance: {
      hideItem,
      showItem,
      toggleItem,
      getIdentifier,
    },
    publicAPI: {
      hideItem,
      showItem,
      toggleItem,
    },
  };
};

useChartVisibilityManager.getInitialState = (params) => ({
  visibilityManager: {
    visibilityMap: params.visibilityMap || {},
    separator: '-',
  },
});

useChartVisibilityManager.params = {
  onVisibilityChange: true,
  separator: true,
  visibilityMap: true,
};
