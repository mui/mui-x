'use client';

import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../internals/store/useChartStore';

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
  const store = useChartStore<[UseChartHighlightSignature]>();

  const isHighlighted = useStore(store, selectorChartsIsHighlighted, [item]);
  const isFaded = useStore(store, selectorChartsIsFaded, [item]);

  return { isHighlighted, isFaded: !isHighlighted && isFaded };
}
