'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { selectorChartDefaultizedSeries } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import { cleanIdentifier } from '../../corePlugins/useChartSeriesConfig/utils/cleanIdentifier';
import { focusAccessibilityProxy } from '../../../components/ChartsAccessibilityProxy/focusAccessibilityProxy';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { getChartPoint } from '../../../getChartPoint';
import { getItemAtAxisPosition } from './utils/getItemAtAxisPosition';
import type { ChartPlugin } from '../../models';
import type {
  FocusItemOptions,
  UseChartKeyboardNavigationSignature,
} from './useChartKeyboardNavigation.types';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { FocusedItemUpdater } from './keyboardFocusHandler.types';

/**
 * Identifier cleaners always emit every key their series type uses, leaving the missing ones
 * `undefined`. A line or area path only knows its series, so it produces a `dataIndex`-less
 * identifier that can not be focused.
 */
function isCompleteFocusIdentifier(identifier: object) {
  return Object.values(identifier).every((value) => value !== undefined);
}

export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  params,
  store,
  instance,
}) => {
  const { chartsLayerContainerRef, chartsAccessibilityProxyRef } = instance;

  /**
   * Whether the next focus change should render the focus.
   * Pointer interactions set it to `false` so that clicking an item sets the item keyboard
   * navigation resumes from, without revealing the focus indicator.
   */
  const focusVisibleIntentRef = React.useRef(true);

  /**
   * Whether an item took the focus during the current pointer interaction, so the axis fallback
   * does not overwrite it. Reset on `pointerdown`.
   */
  const itemFocusedByPointerRef = React.useRef(false);

  const getDefaultFocusVisible = useEventCallback(
    () => params.focusItemOnClick === true || store.state.keyboardNavigation.isFocusVisible,
  );

  /**
   * Writes the focus state, only switching the highlight and tooltip to keyboard when visible.
   * An `undefined` item leaves the focused item untouched, `null` clears it.
   */
  const updateFocus = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType> | null | undefined, isFocusVisible: boolean) => {
      const keyboardNavigation = store.state.keyboardNavigation;

      store.update({
        ...(isFocusVisible &&
          store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
        ...(isFocusVisible &&
          store.state.interaction && {
            interaction: { ...store.state.interaction, lastUpdate: 'keyboard' },
          }),
        keyboardNavigation: {
          ...keyboardNavigation,
          ...(item !== undefined && { item }),
          isFocused: true,
          isFocusVisible,
        },
      });
    },
  );

  const focusChart = useEventCallback((options?: FocusItemOptions) => {
    if (!store.state.keyboardNavigation.enabled) {
      return;
    }

    const isFocusVisible = options?.visible ?? focusVisibleIntentRef.current;
    focusVisibleIntentRef.current = isFocusVisible;

    const container = chartsLayerContainerRef.current;
    if (!container?.contains(document.activeElement)) {
      // Focusing fires `focusin` synchronously, which runs `restoreFocus` with the intent above.
      focusAccessibilityProxy(chartsAccessibilityProxyRef.current);
    }

    const keyboardNavigation = store.state.keyboardNavigation;
    if (keyboardNavigation.isFocused && keyboardNavigation.isFocusVisible === isFocusVisible) {
      return;
    }

    updateFocus(undefined, isFocusVisible);
  });

  const focusItem = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType>, options?: FocusItemOptions) => {
      if (!store.state.keyboardNavigation.enabled) {
        return false;
      }

      const seriesConfig = selectorChartSeriesConfig(store.state);
      if (!seriesConfig[item.type]?.keyboardFocusHandler) {
        // The series type is not part of the keyboard navigation.
        return false;
      }

      const cleanedItem = cleanIdentifier(
        seriesConfig,
        item,
      ) as FocusedItemIdentifier<ChartSeriesType>;
      if (!isCompleteFocusIdentifier(cleanedItem)) {
        return false;
      }

      itemFocusedByPointerRef.current = true;

      const isFocusVisible = options?.visible ?? focusVisibleIntentRef.current;
      focusVisibleIntentRef.current = isFocusVisible;

      const container = chartsLayerContainerRef.current;
      if (!container?.contains(document.activeElement)) {
        focusAccessibilityProxy(chartsAccessibilityProxyRef.current);
      }

      // Read after focusing, `restoreFocus` already ran.
      const keyboardNavigation = store.state.keyboardNavigation;
      if (
        keyboardNavigation.isFocusVisible === isFocusVisible &&
        keyboardNavigation.item != null &&
        fastObjectShallowCompare(keyboardNavigation.item, cleanedItem)
      ) {
        // Two click paths can resolve the same item, for instance a line mark over its line.
        return false;
      }

      updateFocus(cleanedItem, isFocusVisible);
      return true;
    },
  );

  /**
   * Fallback for a click that hit no item: resolve the axis under the pointer and focus the item
   * it points at. Focuses the chart alone when the chart has no axis, or the click is off it.
   */
  const focusItemAtAxisPosition = useEventCallback((event: MouseEvent) => {
    const element = chartsLayerContainerRef.current;

    if (element === null || !store.state.keyboardNavigation.enabled) {
      focusChart();
      return;
    }

    const point = getChartPoint(element, event);
    if (!instance.isPointInside?.(point.x, point.y)) {
      focusChart();
      return;
    }

    const item = getItemAtAxisPosition({
      point,
      xAxis: selectorChartXAxis(store.state),
      yAxis: selectorChartYAxis(store.state),
      processedSeries: selectorChartSeriesProcessed(store.state),
      focusedItem: store.state.keyboardNavigation.item,
    });

    if (item === null) {
      focusChart();
      return;
    }

    focusItem(item);
  });

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

      if (store.state.keyboardNavigation.isFocused) {
        store.set('keyboardNavigation', {
          ...store.state.keyboardNavigation,
          isFocused: false,
          isFocusVisible: false,
        });
      }
    }

    function restoreFocus() {
      const keyboardNavigation = store.state.keyboardNavigation;
      const isFocusVisible = focusVisibleIntentRef.current;

      if (keyboardNavigation.isFocused && keyboardNavigation.isFocusVisible === isFocusVisible) {
        return;
      }

      updateFocus(undefined, isFocusVisible);
    }

    // A pointer interaction hides the focus, unless it is already visible or `focusItemOnClick`
    // is set. Read on `pointerdown`, before the click can blur the proxy.
    function trackPointerIntent() {
      focusVisibleIntentRef.current = getDefaultFocusVisible();
      itemFocusedByPointerRef.current = false;
    }

    // Any key press means the user switched to the keyboard, wherever the focus currently is.
    // Listening on the document also covers tabbing in from outside the chart.
    function trackKeyboardIntent() {
      focusVisibleIntentRef.current = true;
    }

    function focusChartOnClick(event: MouseEvent) {
      if (itemFocusedByPointerRef.current) {
        // A series already resolved the click to one of its items.
        return;
      }

      focusItemAtAxisPosition(event);
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

      const keyboardNavigation = store.state.keyboardNavigation;
      // The item does not move at the edges of a series that does not cycle, but the key was still
      // handled, so a focus set by a click must become visible.
      if (newFocusedItem === keyboardNavigation.item && keyboardNavigation.isFocusVisible) {
        return;
      }

      event.preventDefault();

      updateFocus(newFocusedItem, true);
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('focusout', removeFocus);
    element.addEventListener('focusin', restoreFocus);
    element.addEventListener('pointerdown', trackPointerIntent, true);
    element.addEventListener('click', focusChartOnClick);
    document.addEventListener('keydown', trackKeyboardIntent, true);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('focusout', removeFocus);
      element.removeEventListener('focusin', restoreFocus);
      element.removeEventListener('pointerdown', trackPointerIntent, true);
      element.removeEventListener('click', focusChartOnClick);
      document.removeEventListener('keydown', trackKeyboardIntent, true);
    };
  }, [
    chartsLayerContainerRef,
    params.disableKeyboardNavigation,
    store,
    updateFocus,
    getDefaultFocusVisible,
    focusItemAtAxisPosition,
  ]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return { instance: { focusItem, focusChart } };
};

useChartKeyboardNavigation.getInitialState = (params) => ({
  keyboardNavigation: {
    item: null,
    isFocused: false,
    isFocusVisible: false,
    enabled: !params.disableKeyboardNavigation,
  },
});

useChartKeyboardNavigation.params = {
  disableKeyboardNavigation: true,
  focusItemOnClick: true,
};
