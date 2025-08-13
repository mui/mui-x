'use client';
import { FocusedItemData, useFocusedItem } from './useFocusedItem';

/**
 * A hook to check focus state of multiple items.
 * If you're interested by a single one, consider using `useItemFocused`.
 *
 * @returns {(item: FocusedItemData) => boolean} callbacks to get the state of the item.
 */
export function useItemFocusedGetter() {
  const focusedItem = useFocusedItem();

  return (item: FocusedItemData) =>
    focusedItem !== null &&
    focusedItem.seriesType === item.seriesType &&
    focusedItem.seriesId === item.seriesId &&
    focusedItem.dataIndex === item.dataIndex;
}
