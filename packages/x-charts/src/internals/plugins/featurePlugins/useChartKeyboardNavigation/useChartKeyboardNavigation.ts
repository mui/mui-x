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
   * Writes the focus state, only switching the highlight and tooltip to keyboard when visible.
   * An `undefined` item leaves the focused item untouched, `null` clears it.
   *
   * `isFocused` is read from the DOM rather than assumed: a composition may not render the
   * accessibility proxy, and claiming a focus the chart does not hold would render an indicator
   * that no blur can ever clear. The item is still stored, so it is restored on the next focus.
   */
  const updateFocus = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType> | null | undefined, isFocusVisible: boolean) => {
      const keyboardNavigation = store.state.keyboardNavigation;
      const isFocused = chartsLayerContainerRef.current?.contains(document.activeElement) ?? false;

      store.update({
        ...(isFocused &&
          isFocusVisible &&
          store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
        ...(isFocused &&
          isFocusVisible &&
          store.state.interaction && {
            interaction: { ...store.state.interaction, lastUpdate: 'keyboard' },
          }),
        keyboardNavigation: {
          ...keyboardNavigation,
          ...(item !== undefined && { item }),
          isFocused,
          isFocusVisible: isFocused && isFocusVisible,
        },
      });
    },
  );

  /**
   * Moves the DOM focus into the chart and writes the focus state.
   * An `undefined` item focuses the chart without changing the focused item.
   * @returns `true` when the state changed.
   */
  const applyFocus = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType> | undefined, options?: FocusItemOptions) => {
      if (!store.state.keyboardNavigation.enabled) {
        return false;
      }

      const isFocusVisible = options?.visible ?? focusVisibleIntentRef.current;
      focusVisibleIntentRef.current = isFocusVisible;

      const container = chartsLayerContainerRef.current;
      if (!container?.contains(document.activeElement)) {
        // Focusing fires `focusin` synchronously, which runs `restoreFocus` with the intent above.
        focusAccessibilityProxy(chartsAccessibilityProxyRef.current);
      }

      // Read after focusing, `restoreFocus` already ran.
      const keyboardNavigation = store.state.keyboardNavigation;
      const isSameItem =
        item === undefined ||
        (keyboardNavigation.item != null &&
          fastObjectShallowCompare(keyboardNavigation.item, item));

      if (
        keyboardNavigation.isFocused &&
        keyboardNavigation.isFocusVisible === isFocusVisible &&
        isSameItem
      ) {
        // Nothing to do: two click paths can resolve the same item, a line mark over its line.
        return false;
      }

      updateFocus(item, isFocusVisible);
      return true;
    },
  );

  const focusItem = useEventCallback(
    (item: FocusedItemIdentifier<ChartSeriesType>, options?: FocusItemOptions) => {
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

      return applyFocus(cleanedItem, options);
    },
  );

  /**
   * Focuses the item a click landed on, read from the item the pointer is over. Falls back to the
   * axis under the pointer, which covers the line and area paths, whose hovered item only knows
   * its series.
   *
   * A click that resolves nothing is left alone rather than focusing the chart. The drawing area
   * is a rectangle, but the data rarely fills it: taking the focus from a click next to a pie,
   * outside its circle, reads as the chart grabbing clicks that were not meant for it.
   */
  const focusItemAtPointer = useEventCallback((event: MouseEvent | PointerEvent) => {
    // Every series reports the item under the pointer, so the click itself needs no wiring.
    const hoveredItem = store.state.interaction?.hoveredItem;
    if (hoveredItem != null && focusItem(hoveredItem as FocusedItemIdentifier<ChartSeriesType>)) {
      return;
    }

    const element = chartsLayerContainerRef.current;
    const point = element === null ? null : getChartPoint(element, event);

    const item =
      point && instance.isPointInside?.(point.x, point.y)
        ? getItemAtAxisPosition({
            point,
            xAxis: selectorChartXAxis(store.state),
            yAxis: selectorChartYAxis(store.state),
            processedSeries: selectorChartSeriesProcessed(store.state),
            focusedItem: store.state.keyboardNavigation.item,
          })
        : null;

    if (item !== null) {
      focusItem(item);
    }
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

    // The focus already moved into the chart, so `applyFocus` only reconciles the state with the
    // current intent: its own focusing step is a no-op here.
    function restoreFocus() {
      applyFocus(undefined);
    }

    // A pointer interaction hides the focus, unless it is already visible or `focusItemOnClick`
    // is set. Read on `pointerdown`, before the click can blur the proxy.
    function trackPointerIntent() {
      // A click keeps the focus visible only if it already was, or if the chart opts in.
      focusVisibleIntentRef.current =
        params.focusItemOnClick === true || store.state.keyboardNavigation.isFocusVisible;
    }

    // Any key press means the user switched to the keyboard, wherever the focus currently is.
    // Listening on the document also covers tabbing in from outside the chart.
    function trackKeyboardIntent() {
      focusVisibleIntentRef.current = true;
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
    document.addEventListener('keydown', trackKeyboardIntent, true);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('focusout', removeFocus);
      element.removeEventListener('focusin', restoreFocus);
      element.removeEventListener('pointerdown', trackPointerIntent, true);
      document.removeEventListener('keydown', trackKeyboardIntent, true);
    };
  }, [
    chartsLayerContainerRef,
    params.disableKeyboardNavigation,
    store,
    updateFocus,
    applyFocus,
    params.focusItemOnClick,
  ]);

  React.useEffect(() => {
    if (params.disableKeyboardNavigation) {
      return undefined;
    }

    const tapHandler = instance.addInteractionListener?.('tap', (event) => {
      focusItemAtPointer(event.detail.srcEvent as PointerEvent);
    });

    return () => tapHandler?.cleanup();
  }, [instance, params.disableKeyboardNavigation, focusItemAtPointer]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return { instance: { focusItem } };
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
