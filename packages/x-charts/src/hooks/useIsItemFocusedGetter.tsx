'use client';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { FocusedItemIdentifier } from '../models/seriesType';
import type { ChartSeriesType } from '../models/seriesType/config';
import { useFocusedItem } from './useFocusedItem';

/**
 * A hook to check focus state of multiple items.
 * If you're interested by a single one, consider using `useIsItemFocused`.
 *
 * @returns {(item: FocusedItemData) => boolean} callback to get the state of the item.
 */
export function useIsItemFocusedGetter() {
  const focusedItem = useFocusedItem();

  return (item: FocusedItemIdentifier<ChartSeriesType>) =>
    focusedItem !== null && fastObjectShallowCompare(focusedItem, item);
}
