'use client';
import { FocusedItemData, useFocusedItem } from './useFocusedItem';

type UseItemFocusedParams = FocusedItemData;

/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightedGetter` hook instead.
 *
 * @param {FocusedItemData} item is the item to check
 * @returns {boolean} the state of the item
 */
export function useItemFocused(item: UseItemFocusedParams): boolean {
  const focusedItem = useFocusedItem();

  return (
    focusedItem !== null &&
    focusedItem.seriesType === item.seriesType &&
    focusedItem.seriesId === item.seriesId &&
    focusedItem.dataIndex === item.dataIndex
  );
}
