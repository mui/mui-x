import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type ChartSeriesType, type HighlightScope } from '../../../../models/seriesType/config';
import { type ChartRootSelector } from '../../utils/selectors';
import { type HighlightItemData, type UseChartHighlightSignature } from './useChartHighlight.types';
import { createIsHighlighted } from './createIsHighlighted';
import { createIsFaded } from './createIsFaded';
import {
  getSeriesHighlightedDataIndex,
  getSeriesUnfadedDataIndex,
  isSeriesFaded,
  isSeriesHighlighted,
} from './highlightStates';
import { selectorChartsKeyboardItem } from '../useChartKeyboardNavigation';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';

const selectHighlight: ChartRootSelector<UseChartHighlightSignature> = (state) => state.highlight;

export const selectorChartsHighlightScopePerSeriesId = createSelectorMemoized(
  selectorChartSeriesProcessed,
  (processedSeries): Map<SeriesId, Partial<HighlightScope<any>> | undefined> => {
    const map = new Map<SeriesId, Partial<HighlightScope<any>> | undefined>();

    Object.keys(processedSeries).forEach((seriesType) => {
      const seriesData = processedSeries[seriesType as ChartSeriesType];
      seriesData?.seriesOrder?.forEach((seriesId) => {
        const seriesItem = seriesData?.series[seriesId];
        map.set(seriesId, seriesItem?.highlightScope);
      });
    });
    return map;
  },
);

export const selectorChartsHighlightedItem = createSelectorMemoized(
  selectHighlight,
  selectorChartsKeyboardItem,
  function selectorChartsHighlightedItem(highlight, keyboardItem) {
    return highlight.isControlled || highlight.lastUpdate === 'pointer'
      ? highlight.item
      : keyboardItem;
  },
);

export const selectorChartsHighlightScope = createSelector(
  selectorChartsHighlightScopePerSeriesId,
  selectorChartsHighlightedItem,
  function selectorChartsHighlightScope(seriesIdToHighlightScope, highlightedItem) {
    if (!highlightedItem) {
      return null;
    }
    const highlightScope = seriesIdToHighlightScope.get(highlightedItem.seriesId);

    if (highlightScope === undefined) {
      return null;
    }

    return highlightScope;
  },
);

export const selectorChartsIsHighlightedCallback = createSelectorMemoized(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  createIsHighlighted,
);

export const selectorChartsIsFadedCallback = createSelectorMemoized(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  createIsFaded,
);

export const selectorChartsIsHighlighted = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartsIsHighlighted(
    highlightScope,
    highlightedItem,
    item: HighlightItemData | null,
  ) {
    return createIsHighlighted(highlightScope, highlightedItem)(item);
  },
);

export const selectorChartIsSeriesHighlighted = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  isSeriesHighlighted,
);

export const selectorChartIsSeriesFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  isSeriesFaded,
);

export const selectorChartSeriesUnfadedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  getSeriesUnfadedDataIndex,
);

export const selectorChartSeriesHighlightedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  getSeriesHighlightedDataIndex,
);

export const selectorChartsIsFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartsIsFaded(highlightScope, highlightedItem, item: HighlightItemData | null) {
    return createIsFaded(highlightScope, highlightedItem)(item);
  },
);
