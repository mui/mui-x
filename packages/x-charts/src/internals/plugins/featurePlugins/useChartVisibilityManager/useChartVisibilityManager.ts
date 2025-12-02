import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { buildIdentifier as buildIdentifierFn } from './isIdentifierVisible';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  const buildIdentifier = useEventCallback((ids: string | (string | number)[]) =>
    buildIdentifierFn(store.state.visibilityManager.separator, ids),
  );

  const hideItem = useEventCallback((identifier: string | (number | string)[]) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = buildIdentifier(identifier);

    if (visibilityMap[id] === false) {
      return; // Already hidden
    }

    const newVisibility = { ...visibilityMap, [id]: false };
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibility,
    });

    params.onVisibilityChange?.(newVisibility);
  });

  const showItem = useEventCallback((identifier: string | (number | string)[]) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = buildIdentifier(identifier);

    if (visibilityMap[id] !== false) {
      return; // Already visible
    }

    const newVisibility = { ...visibilityMap, [id]: true };
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibility,
    });

    params.onVisibilityChange?.(newVisibility);
  });

  const toggleItem = useEventCallback((identifier: string | (number | string)[]) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = buildIdentifier(identifier);

    if (visibilityMap[id] === false) {
      showItem(id);
    } else {
      hideItem(id);
    }
  });

  return {
    instance: {
      hideItem,
      showItem,
      toggleItem,
      buildIdentifier,
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
