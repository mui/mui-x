'use client';
import type { FocusedItemIdentifier } from '../models/seriesType';
import type { ChartSeriesType } from '../models/seriesType/config';
import { useFocusedItem } from './useFocusedItem';
import { useChartContext } from '../context/ChartProvider';

/**
 * A hook to check focus state of multiple items.
 * If you're interested by a single one, consider using `useIsItemFocused`.
 *
 * @returns {(item: FocusedItemData) => boolean} callback to get the state of the item.
 */
export function useIsItemFocusedGetter() {
  const focusedItem = useFocusedItem();
  const { instance } = useChartContext();

  return (item: FocusedItemIdentifier<ChartSeriesType>) =>
    instance.isSameIdentifier(focusedItem, item);
}
