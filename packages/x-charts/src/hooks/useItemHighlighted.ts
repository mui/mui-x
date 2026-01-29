'use client';

import { useStore } from '../internals/store/useStore';
import {
  selectorChartsIsFaded,
  selectorChartsIsHighlighted,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.types';
import type { SeriesItemIdentifier, ChartSeriesType } from '../models/seriesType';

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

type UseItemHighlightedParams<SeriesType extends ChartSeriesType = ChartSeriesType> =
  SeriesItemIdentifier<SeriesType> | null;

/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightedGetter` hook instead.
 *
 * @param {SeriesItemIdentifier<SeriesType> | null} item is the item to check
 * @returns {UseItemHighlightedReturnType} the state of the item
 */
export function useItemHighlighted<SeriesType extends ChartSeriesType = ChartSeriesType>(
  item: UseItemHighlightedParams<SeriesType>,
): UseItemHighlightedReturnType {
  const store = useStore<[UseChartHighlightSignature<SeriesType>]>();

  const isHighlighted = store.use(selectorChartsIsHighlighted, item);
  const isFaded = store.use(selectorChartsIsFaded, item);

  return { isHighlighted, isFaded: !isHighlighted && isFaded };
}
