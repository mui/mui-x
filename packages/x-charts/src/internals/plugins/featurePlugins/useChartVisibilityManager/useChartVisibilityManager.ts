'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { type ChartPlugin } from '../../models';
import {
  type VisibilityIdentifierWithType,
  type UseChartVisibilityManagerSignature,
  type VisibilityIdentifier,
} from './useChartVisibilityManager.types';
import { EMPTY_VISIBILITY_MAP } from './useChartVisibilityManager.selectors';
import { visibilityParamToMap } from './visibilityParamToMap';
import { createIdentifierWithType } from '../../corePlugins/useChartSeries/useChartSeries';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature<any>> = ({
  store,
  params,
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
      visibilityMap: visibilityParamToMap(
        params.hiddenItems.map((item) => instance.identifierWithType(item, 'visibility')),
        store.state.seriesConfig.config,
      ),
    });
  }, [store, instance, params.hiddenItems]);

  const hideItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const identifierWithType = instance.identifierWithType(identifier, 'visibility');
    const id = instance.serializeIdentifier(identifierWithType);

    if (visibilityMap.has(id)) {
      return;
    }

    const newVisibilityMap = new Map(visibilityMap);
    newVisibilityMap.set(id, identifierWithType);

    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibilityMap,
    });

    const values: VisibilityIdentifierWithType[] = Array.from(newVisibilityMap.values());
    params.onHiddenItemsChange?.(values);
  });

  const showItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const identifierWithType = instance.identifierWithType(identifier, 'visibility');
    const id = instance.serializeIdentifier(identifierWithType);

    if (!visibilityMap.has(id)) {
      return;
    }

    const newVisibilityMap = new Map(visibilityMap);
    newVisibilityMap.delete(id);

    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: newVisibilityMap,
    });

    params.onHiddenItemsChange?.(
      Array.from(newVisibilityMap.values()) as VisibilityIdentifierWithType[],
    );
  });

  const toggleItem = useEventCallback((identifier: VisibilityIdentifier) => {
    const visibilityMap = store.state.visibilityManager.visibilityMap;
    const identifierWithType = instance.identifierWithType(identifier, 'visibility');
    const id = instance.serializeIdentifier(identifierWithType);

    if (visibilityMap.has(id)) {
      showItem(identifierWithType);
    } else {
      hideItem(identifierWithType);
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

useChartVisibilityManager.getInitialState = (params, currentState) => {
  const seriesConfig = currentState.seriesConfig.config;
  const initialItems = params.hiddenItems ?? params.initialHiddenItems;
  return {
    visibilityManager: {
      visibilityMap: initialItems
        ? visibilityParamToMap(
            initialItems.map((item) => createIdentifierWithType(currentState)(item)),
            seriesConfig,
          )
        : EMPTY_VISIBILITY_MAP,
      isControlled: params.hiddenItems !== undefined,
    },
  };
};

useChartVisibilityManager.params = {
  onHiddenItemsChange: true,
  hiddenItems: true,
  initialHiddenItems: true,
};
