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

  const announceZoomChange = React.useCallback(() => {
    if (store.state.keyboardNavigation.announceZoom) {
      return;
    }
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      announceZoom: true,
    });
  }, [store]);

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;

    if (!element || params.disableKeyboardNavigation) {
      return undefined;
    }

    function removeFocus(event: FocusEvent) {
      const root = event.currentTarget as HTMLElement | null;
      const next = event.relatedTarget as Node | null;

      // Avoid removing focus if we know it is moving to another children in the chart.
      // This avoid extra computation ot remove/add focus at each keyboard pressed when navigating in the chart.
      // A null relatedTarget means focus left to a non-focusable element (clicking outside), so focus is removed.
      if (root && next !== null && root.contains(next)) {
        return;
      }

      if (store.state.keyboardNavigation.isFocused || store.state.keyboardNavigation.announceZoom) {
        store.set('keyboardNavigation', {
          ...store.state.keyboardNavigation,
          isFocused: false,
          // The zoom range is only announced while the user operates the chart.
          announceZoom: false,
        });
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
      // Ignore the auto-repeat while the key is held: a pointer click does not repeat either.
      if (
        event.repeat ||
        !isItemActivationKey(event) ||
        !selectorChartsIsKeyboardActivationEnabled(store.state)
      ) {
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
      // Item navigation only uses unmodified keys.
      // Modified ones are left to the browser, and to chart interactions such as keyboard zoom and pan.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

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

  return { instance: { registerItemActivationHandler, announceZoomChange } };
};

useChartKeyboardNavigation.getInitialState = (params) => ({
  keyboardNavigation: {
    item: null,
    isFocused: false,
    enabled: !params.disableKeyboardNavigation,
    announceZoom: false,
  },
});

useChartKeyboardNavigation.params = {
  disableKeyboardNavigation: true,
};
