'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartsItemIsFocused } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { FocusedItemIdentifier } from '../models/seriesType';

type UseItemFocusedParams = FocusedItemIdentifier<ChartSeriesType>;

/**
 * A hook to check if an item has the focus.
 *
 * If you need to process multiple points, use the `useIsItemFocusedGetter` hook instead.
 *
 * @param {FocusedItemIdentifier} item is the item to check
 * @returns {boolean} the focus state
 */
export function useIsItemFocused(item: UseItemFocusedParams): boolean {
  const store = useStore();
  return store.use(selectorChartsItemIsFocused, item);
}
