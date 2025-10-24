'use client';

import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import {
  selectorChartsIsFaded,
  selectorChartsIsHighlighted,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import {
  HighlightItemData,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.types';

type UseItemHighlightedReturnType = {
  /**
   * Whether the item is highlighted.
   */
  isHighlighted: boolean;
  /**
   * Whether the item is faded.
   */
  isFaded: boolean;
};

type UseItemHighlightedParams = HighlightItemData | null;

/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightedGetter` hook instead.
 *
 * @param {HighlightItemData | null} item is the item to check
 * @returns {UseItemHighlightedReturnType} the state of the item
 */
export function useItemHighlighted(item: UseItemHighlightedParams): UseItemHighlightedReturnType {
  const store = useStore<[UseChartHighlightSignature]>();

  const isHighlighted = useSelector(store, selectorChartsIsHighlighted, item);
  const isFaded = useSelector(store, selectorChartsIsFaded, item);

  return { isHighlighted, isFaded: !isHighlighted && isFaded };
}
