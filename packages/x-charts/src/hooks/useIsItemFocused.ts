'use client';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { FocusedItemData, useFocusedItem } from './useFocusedItem';
import { selectorChartsIsFocused } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';

type UseItemFocusedParams = FocusedItemData;

/**
 * A hook to check if an item has the focus.
 *
 * If you need to process multiple points, use the `useIsItemFocusedGetter` hook instead.
 *
 * @param {FocusedItemData} item is the item to check
 * @returns {boolean} the focus state
 */
export function useIsItemFocused(item: UseItemFocusedParams): boolean {
  const store = useStore();
  return useSelector(store, selectorChartsIsFocused, [item] as const);
}
