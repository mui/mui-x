'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartsHighlightStateCallback } from '../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.selectors';
import type { UseChartHighlightSignature } from '../plugins';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { HighlightItemIdentifierWithType } from '../models/seriesType';
import type { ComposableChartSeriesType } from '../models/seriesType/composition';
import type { HighlightState } from './useItemHighlightState';

/**
 * A hook to get a callback that returns the highlight state of an item.
 *
 * If you're interested by a single item, consider using `useItemHighlightState`.
 *
 * @returns {(item: HighlightItemIdentifierWithType | null) => HighlightState} callback to get the highlight state of an item.
 */
export function useItemHighlightStateGetter<
  SeriesType extends ChartSeriesType = ChartSeriesType,
>(): (
  item: HighlightItemIdentifierWithType<ComposableChartSeriesType<SeriesType>> | null,
) => HighlightState {
  const store = useStore<[UseChartHighlightSignature<SeriesType>]>();

  const getHighlightState = store.use(selectorChartsHighlightStateCallback<SeriesType>);
  return getHighlightState;
}
