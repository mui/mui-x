'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import { getChartPoint } from '../../../getChartPoint';
import { selectorChartDefaultizedSeries } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import type { ChartPlugin } from '../../models';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemUpdater } from './keyboardFocusHandler.types';

export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  params,
  store,
  instance,
}) => {
  const { chartsLayerContainerRef } = instance;

  const setKeyboardNavigationItem = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType> | null) => {
      if (params.disableKeyboardNavigation) {
        return;
      }

      const cleanedItem =
        item === null
          ? null
          : (instance.cleanIdentifier(
              item,
              'seriesItem',
            ) as FocusedItemIdentifier<ChartSeriesType>);

      store.update({
        ...(store.state.highlight && {
          highlight: {
            ...store.state.highlight,
            lastUpdate: 'keyboard',
          },
        }),
        ...(store.state.interaction && {
          interaction: {
            ...store.state.interaction,
            lastUpdate: 'keyboard',
          },
        }),
        keyboardNavigation: {
          ...store.state.keyboardNavigation,
          item: cleanedItem,
          focusRequestId: store.state.keyboardNavigation.focusRequestId + 1,
        },
      });
    },
  );

  const handleKeyboardNavigationClick = useEventCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (params.disableKeyboardNavigation) {
        return;
      }

      const point = getChartPoint(event.currentTarget, event);

      if (!instance.isPointInside(point.x, point.y)) {
        return;
      }

      for (const seriesType of Object.keys(store.state.seriesConfig.config)) {
        // @ts-ignore The type inference for store.state does not support generic series configs yet.
        const item = store.state.seriesConfig.config[seriesType].getItemAtPosition?.(store.state, {
          x: point.x,
          y: point.y,
        });

        if (item) {
          setKeyboardNavigationItem(item);
          return;
        }
      }
    },
  );

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;

    if (!element || params.disableKeyboardNavigation) {
      return undefined;
    }

    function removeFocus(event: FocusEvent) {
      const root = event.currentTarget as HTMLElement;
      const next = event.relatedTarget as HTMLElement | null;

      // Avoid removing focus if we know it is moving to another children in the chart.
      // This avoid extra computation ot remove/add focus at each keyboard pressed when navigating in the chart.
      if (root && next instanceof Node && !root.contains(next)) {
        if (store.state.keyboardNavigation.isFocused) {
          store.set('keyboardNavigation', {
            ...store.state.keyboardNavigation,
            isFocused: false,
          });
        }
      }
    }

    function restoreFocus() {
      if (!store.state.keyboardNavigation.isFocused) {
        store.update({
          ...(store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
          ...(store.state.interaction && {
            interaction: { ...store.state.interaction, lastUpdate: 'keyboard' },
          }),
          keyboardNavigation: {
            ...store.state.keyboardNavigation,
            isFocused: true,
          },
        });
      }
    }

    function keyboardHandler(event: KeyboardEvent) {
      let newFocusedItem = store.state.keyboardNavigation.item;

      const seriesConfig = selectorChartSeriesConfig(store.state);

      let seriesType = newFocusedItem?.type;
      if (!seriesType) {
        seriesType = (
          Object.keys(selectorChartDefaultizedSeries(store.state)) as ChartSeriesType[]
        ).find((key) => seriesConfig[key] !== undefined);

        if (seriesType === undefined) {
          return;
        }
      }

      const calculateFocusedItem = seriesConfig[seriesType]?.keyboardFocusHandler?.(event) as
        FocusedItemUpdater<typeof seriesType> | undefined;

      if (!calculateFocusedItem) {
        return;
      }

      newFocusedItem = calculateFocusedItem(newFocusedItem, store.state);

      if (newFocusedItem !== store.state.keyboardNavigation.item) {
        event.preventDefault();
        setKeyboardNavigationItem(newFocusedItem);
      }
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('focusout', removeFocus);
    element.addEventListener('focusin', restoreFocus);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('focusout', removeFocus);
      element.removeEventListener('focusin', restoreFocus);
    };
  }, [chartsLayerContainerRef, params.disableKeyboardNavigation, setKeyboardNavigationItem, store]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return {
    instance: {
      handleKeyboardNavigationClick,
      setKeyboardNavigationItem,
    },
  };
};

useChartKeyboardNavigation.getInitialState = (params) => ({
  keyboardNavigation: {
    item: null,
    isFocused: false,
    enabled: !params.disableKeyboardNavigation,
    focusRequestId: 0,
  },
});

useChartKeyboardNavigation.params = {
  disableKeyboardNavigation: true,
};
