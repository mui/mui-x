'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { type ChartPlugin } from '../../models';
import {
  type UseChartVisibilityManagerSignature,
  type VisibilityIdentifier,
} from './useChartVisibilityManager.types';
import { EMPTY_VISIBILITY_MAP } from './useChartVisibilityManager.selectors';
import { visibilityParamToMap } from './visibilityParamToMap';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature<any>> = ({
  store,
  params,
  seriesConfig,
  instance,
}) => {
  // Manage controlled state
  useEffectAfterFirstRender(() => {
    if (params.hiddenItems === undefined) {
      return;
    }

    if (process.env.NODE_ENV !== 'production' && !store.state.visibilityManager.isControlled) {
      console.error(
        [
          `MUI X Charts: A chart component is changing the \`hiddenItems\` from uncontrolled to controlled.`,
          'Elements should not switch from uncontrolled to controlled (or vice versa).',
          'Decide between using a controlled or uncontrolled for the lifetime of the component.',
          "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
          'More info: https://fb.me/react-controlled-components',
        ].join('\n'),
      );
    }
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: visibilityParamToMap(params.hiddenItems, seriesConfig),
    });
  }, [store, params.hiddenItems, seriesConfig]);

  const hideItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = instance.serializeIdentifier(identifier);

    if (visibilityMap.has(id)) {
      return;
    }

    const newVisibilityMap = new Map(visibilityMap);
    newVisibilityMap.set(id, identifier);

    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibilityMap,
    });

    params.onHiddenItemsChange?.(Array.from(newVisibilityMap.values()));
  });

  const showItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = instance.serializeIdentifier(identifier);

    if (!visibilityMap.has(id)) {
      return;
    }

    const newVisibilityMap = new Map(visibilityMap);
    newVisibilityMap.delete(id);

    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibilityMap,
    });

    params.onHiddenItemsChange?.(Array.from(newVisibilityMap.values()));
  });

  const toggleItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const id = instance.serializeIdentifier(identifier);

    if (visibilityMap.has(id)) {
      showItem(identifier);
    } else {
      hideItem(identifier);
    }
  });

  return {
    instance: {
      hideItem,
      showItem,
      toggleItemVisibility: toggleItem,
    },
  };
};

useChartVisibilityManager.getInitialState = (params, _, seriesConfig) => ({
  visibilityManager: {
    visibilityMap: params.hiddenItems
      ? visibilityParamToMap(params.hiddenItems, seriesConfig)
      : EMPTY_VISIBILITY_MAP,
    isControlled: params.hiddenItems !== undefined,
  },
});

useChartVisibilityManager.params = {
  onHiddenItemsChange: true,
  hiddenItems: true,
};
