'use client';

import { useStore } from '../internals/store/useStore';
import { selectorChartsHighlightState } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.types';
import type { HighlightItemIdentifierWithType } from '../models/seriesType';
import type { ChartSeriesType } from '../models/seriesType/config';

export type HighlightState = 'highlighted' | 'faded' | 'none';

type UseItemHighlightedReturnType = HighlightState;

type UseItemHighlightedParams<SeriesType extends ChartSeriesType = ChartSeriesType> =
  HighlightItemIdentifierWithType<SeriesType> | null;

/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightStateGetter` hook instead.
 *
 * @param {HighlightItemIdentifierWithType<SeriesType> | null} item is the item to check
 * @returns {HighlightState} the state of the item
 */
export function useItemHighlightState<SeriesType extends ChartSeriesType = ChartSeriesType>(
  item: UseItemHighlightedParams<SeriesType>,
): UseItemHighlightedReturnType {
  const store = useStore<[UseChartHighlightSignature<SeriesType>]>();

  return store.use(selectorChartsHighlightState, item);
}
