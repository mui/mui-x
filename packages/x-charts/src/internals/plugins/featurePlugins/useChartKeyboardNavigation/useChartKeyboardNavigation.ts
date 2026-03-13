'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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
  const removeFocus = useEventCallback(function removeFocus() {
    if (store.state.keyboardNavigation.isFocused) {
      store.set('keyboardNavigation', {
        ...store.state.keyboardNavigation,
        isFocused: false,
      });
    }
  });

  const restoreFocus = useEventCallback(function restoreFocus() {
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
  });

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;

    if (!element || params.disableKeyboardNavigation) {
      return undefined;
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
        | FocusedItemUpdater<typeof seriesType>
        | undefined;

      if (!calculateFocusedItem) {
        return;
      }

      newFocusedItem = calculateFocusedItem(newFocusedItem, store.state);

      if (newFocusedItem !== store.state.keyboardNavigation.item) {
        event.preventDefault();

        store.update({
          ...(store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
          ...(store.state.interaction && {
            interaction: { ...store.state.interaction, lastUpdate: 'keyboard' },
          }),
          keyboardNavigation: {
            ...store.state.keyboardNavigation,
            item: newFocusedItem,
          },
        });
      }
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('blur', removeFocus);
    element.addEventListener('focus', restoreFocus);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('blur', removeFocus);
      element.removeEventListener('focus', restoreFocus);
    };
  }, [chartsLayerContainerRef, removeFocus, restoreFocus, params.disableKeyboardNavigation, store]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return {};
};

useChartKeyboardNavigation.getInitialState = (params) => ({
  keyboardNavigation: {
    item: null,
    isFocused: false,
    enabled: !params.disableKeyboardNavigation,
  },
});

useChartKeyboardNavigation.params = {
  disableKeyboardNavigation: true,
};
