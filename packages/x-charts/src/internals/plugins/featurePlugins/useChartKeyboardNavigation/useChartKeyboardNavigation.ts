'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { selectorChartDefaultizedSeries } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import type { ChartPlugin } from '../../models';
import type {
  ItemActivationHandler,
  ItemActivationScope,
  UseChartKeyboardNavigationSignature,
} from './useChartKeyboardNavigation.types';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemUpdater } from './keyboardFocusHandler.types';
import { findItemActivationHandler, isItemActivationKey } from './itemActivation';
import type { ItemActivationRegistration } from './itemActivation';
import { selectorChartsIsKeyboardActivationEnabled } from './useChartKeyboardNavigation.selectors';

export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  params,
  store,
  instance,
}) => {
  const { chartsLayerContainerRef } = instance;

  const activationRegistrationsRef = React.useRef(new Map<number, ItemActivationRegistration>());
  const nextRegistrationIdRef = React.useRef(0);

  const registerItemActivationHandler = React.useCallback(
    (scope: ItemActivationScope, handler: ItemActivationHandler) => {
      const registrationId = nextRegistrationIdRef.current;
      nextRegistrationIdRef.current += 1;

      const registrations = activationRegistrationsRef.current;
      registrations.set(registrationId, { scope, handler });

      return () => {
        registrations.delete(registrationId);
      };
    },
    [],
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

    function activationHandler(event: KeyboardEvent) {
      if (!isItemActivationKey(event) || !selectorChartsIsKeyboardActivationEnabled(store.state)) {
        return;
      }

      const focusedItem = store.state.keyboardNavigation.item;
      if (focusedItem === null || !store.state.keyboardNavigation.isFocused) {
        return;
      }

      const handler = findItemActivationHandler(
        activationRegistrationsRef.current.values(),
        focusedItem,
      );

      if (handler === null) {
        return;
      }

      event.preventDefault();
      handler(event, focusedItem);
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

    element.addEventListener('keydown', activationHandler);
    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('focusout', removeFocus);
    element.addEventListener('focusin', restoreFocus);
    return () => {
      element.removeEventListener('keydown', activationHandler);
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('focusout', removeFocus);
      element.removeEventListener('focusin', restoreFocus);
    };
  }, [chartsLayerContainerRef, params.disableKeyboardNavigation, store]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return { instance: { registerItemActivationHandler } };
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
