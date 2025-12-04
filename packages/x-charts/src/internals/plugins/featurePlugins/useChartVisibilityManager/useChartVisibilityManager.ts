'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { type ChartPlugin } from '../../models';
import { type UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { buildIdentifier as buildIdentifierFn } from './isIdentifierVisible';
import { EMPTY_VISIBILITY_MAP } from './useChartVisibilityManager.selectors';

export const useChartVisibilityManager: ChartPlugin<UseChartVisibilityManagerSignature> = ({
  store,
  params,
}) => {
  // Manage controlled state
  useEffectAfterFirstRender(() => {
    if (params.visibilityMap === undefined) {
      return;
    }

    if (process.env.NODE_ENV !== 'production' && !store.state.visibilityManager.isControlled) {
      console.error(
        [
          `MUI X Charts: A chart component is changing the \`visibilityMap\` from uncontrolled to controlled.`,
          'Elements should not switch from uncontrolled to controlled (or vice versa).',
          'Decide between using a controlled or uncontrolled for the lifetime of the component.',
          "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
          'More info: https://fb.me/react-controlled-components',
        ].join('\n'),
      );
    }
    store.set('visibilityManager', {
      ...store.state.visibilityManager,
      visibilityMap: params.visibilityMap,
    });
  }, [store, params.visibilityMap]);

  const buildIdentifier = useEventCallback((ids: string | (string | number)[]) =>
    buildIdentifierFn(ids),
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
    visibilityMap: params.visibilityMap || EMPTY_VISIBILITY_MAP,
    isControlled: params.visibilityMap !== undefined,
  },
});

useChartVisibilityManager.params = {
  onVisibilityChange: true,
  visibilityMap: true,
};
