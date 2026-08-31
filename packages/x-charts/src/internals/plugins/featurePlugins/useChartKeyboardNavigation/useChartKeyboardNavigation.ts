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
import { getItemAtRotationIndex } from './utils/getItemAtRotationIndex';
import { selectorChartRotationAxis } from '../useChartPolarAxis/useChartPolarAxis.selectors';
import { selectorChartsInteractionRotationAxisIndex } from '../useChartPolarAxis/useChartPolarInteraction.selectors';
import type { ChartPlugin } from '../../models';
import type {
  FocusItemOptions,
  ItemActivationHandler,
  ItemActivationScope,
  UseChartKeyboardNavigationSignature,
} from './useChartKeyboardNavigation.types';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { FocusedItemUpdater } from './keyboardFocusHandler.types';
import { findItemActivationHandler, isItemActivationKey } from './itemActivation';
import type { ItemActivationRegistration } from './itemActivation';
import {
  selectorChartsIsFocusVisible,
  selectorChartsIsKeyboardActivationEnabled,
} from './useChartKeyboardNavigation.selectors';

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
   * Whether the last interaction came from the keyboard.
   * Only then do the highlight and the tooltip follow the focused item: after a click the pointer
   * is still on the chart, and they must keep following it.
   */
  const isKeyboardModalityRef = React.useRef(true);

  /**
   * The item a tap resolved, waiting for the click to focus it.
   *
   * The two steps cannot be merged. Touch clears the pointer item on `pointerleave`, right after
   * the tap, so the item has to be read early. But touch also emits its compatibility `mousedown`
   * after that, which moves the focus to the body, so the focus has to be taken late, on the click
   * that closes the sequence.
   */
  const pendingFocusItemRef = React.useRef<FocusedItemIdentifier<ChartSeriesType> | null>(null);

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
      // Only the keyboard hands the highlight and the tooltip over to the focused item. A click
      // moves the focus, but the pointer is still there and they must keep following it.
      const followsFocus = isFocused && isFocusVisible && isKeyboardModalityRef.current;

      store.update({
        ...(followsFocus &&
          store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
        ...(followsFocus &&
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
   * The item a click landed on, read from the item the pointer is over. An area or line path only
   * knows its series, and a radar reports no item at all, so an incomplete one falls back to the
   * axis under the pointer.
   *
   * A click that resolves nothing is left alone rather than focusing the chart. The drawing area
   * is a rectangle, but the data rarely fills it: taking the focus from a click next to a pie,
   * outside its circle, reads as the chart grabbing clicks that were not meant for it.
   */
  const resolveItemAtPointer = useEventCallback((event: MouseEvent | PointerEvent) => {
    const seriesConfig = selectorChartSeriesConfig(store.state);
    const hoveredItem = store.state.interaction?.hoveredItem;
    // Cleaned before the check, because what a series stores is not always an identifier: the
    // scatter reports its whole data point, whose optional `id` would read as an incomplete one.
    const cleanedHoveredItem =
      hoveredItem == null
        ? null
        : (cleanIdentifier(seriesConfig, hoveredItem) as FocusedItemIdentifier<ChartSeriesType>);

    // Series that report a complete item need no further wiring.
    if (cleanedHoveredItem != null && isCompleteFocusIdentifier(cleanedHoveredItem)) {
      return cleanedHoveredItem;
    }

    const element = chartsLayerContainerRef.current;
    const point = element === null ? null : getChartPoint(element, event);

    if (!point || !instance.isPointInside?.(point.x, point.y)) {
      return null;
    }

    const processedSeries = selectorChartSeriesProcessed(store.state);
    // An incomplete hovered item still names the series under the pointer, which is a better
    // target than the focused one: a click on a series should stay on it.
    const focusedItem = cleanedHoveredItem ?? store.state.keyboardNavigation.item;

    const item = getItemAtAxisPosition({
      point,
      xAxis: selectorChartXAxis(store.state),
      yAxis: selectorChartYAxis(store.state),
      processedSeries,
      focusedItem,
    });

    if (item !== null) {
      return item;
    }

    // A radar area only covers the polygon the data draws, so a click inside the chart but outside
    // it resolves nothing above. Fall back to the rotation axis, the same one the highlight uses.
    if (selectorChartRotationAxis(store.state).axisIds.length === 0) {
      return null;
    }

    return getItemAtRotationIndex({
      dataIndex: selectorChartsInteractionRotationAxisIndex(store.state),
      processedSeries,
      focusedItem,
    });
  });

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
      isKeyboardModalityRef.current = false;
      pendingFocusItemRef.current = null;
    }

    // Any key press means the user switched to the keyboard, wherever the focus currently is.
    // Listening on the document also covers tabbing in from outside the chart.
    function trackKeyboardIntent() {
      focusVisibleIntentRef.current = true;
      isKeyboardModalityRef.current = true;
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

      // The focus has to be visible, not merely held: a click sets the item without revealing it,
      // and activating an item the user cannot see would be a surprise.
      const focusedItem = store.state.keyboardNavigation.item;
      if (focusedItem === null || !selectorChartsIsFocusVisible(store.state)) {
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

      const keyboardNavigation = store.state.keyboardNavigation;
      // The item does not move at the edges of a series that does not cycle, but the key was still
      // handled, so a focus set by a click must become visible.
      if (newFocusedItem === keyboardNavigation.item && keyboardNavigation.isFocusVisible) {
        return;
      }

      event.preventDefault();

      updateFocus(newFocusedItem, true);
    }

    element.addEventListener('keydown', activationHandler);
    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('focusout', removeFocus);
    element.addEventListener('focusin', restoreFocus);
    element.addEventListener('pointerdown', trackPointerIntent, true);
    document.addEventListener('keydown', trackKeyboardIntent, true);
    return () => {
      element.removeEventListener('keydown', activationHandler);
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
      pendingFocusItemRef.current = resolveItemAtPointer(event.detail.srcEvent as PointerEvent);
    });

    function focusPendingItem(event: MouseEvent) {
      const item = pendingFocusItemRef.current;
      pendingFocusItemRef.current = null;

      // A handler stopping the propagation keeps the click from reaching this listener, leaving
      // the item pending. Checking the target stops it from landing on an unrelated later click.
      if (item !== null && chartsLayerContainerRef.current?.contains(event.target as Node)) {
        focusItem(item);
      }
    }

    // Listens on the document so it runs after the React handlers, which are attached to the
    // React root above the chart container.
    document.addEventListener('click', focusPendingItem);

    return () => {
      tapHandler?.cleanup();
      document.removeEventListener('click', focusPendingItem);
    };
  }, [
    instance,
    params.disableKeyboardNavigation,
    resolveItemAtPointer,
    focusItem,
    chartsLayerContainerRef,
  ]);

  useEnhancedEffect(() => {
    store.set('keyboardNavigation', {
      ...store.state.keyboardNavigation,
      enabled: !params.disableKeyboardNavigation,
    });
  }, [store, params.disableKeyboardNavigation]);

  return { instance: { focusItem, registerItemActivationHandler } };
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
