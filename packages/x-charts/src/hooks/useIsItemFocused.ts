'use client';
import { type FocusedItemData } from './useFocusedItem';
import { useStore } from '../internals/store/useStore';
import { selectorChartsItemIsFocused } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';

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
  return store.use(selectorChartsItemIsFocused, item);
}
