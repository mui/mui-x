import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { SeriesId } from '../../../../models/seriesType/common';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { ChartRootSelector } from '../../utils/selectors';
import { HighlightItemData, UseChartHighlightSignature } from './useChartHighlight.types';
import { HighlightScope } from './highlightConfig.types';
import { createIsHighlighted } from './createIsHighlighted';
import { createIsFaded } from './createIsFaded';
import {
  getSeriesHighlightedItem,
  getSeriesUnfadedItem,
  isSeriesFaded,
  isSeriesHighlighted,
} from './highlightStates';
import { selectorChartsKeyboardItem } from '../useChartKeyboardNavigation';

const selectHighlight: ChartRootSelector<UseChartHighlightSignature> = (state) => state.highlight;

const selectSeries: ChartRootSelector<UseChartSeriesSignature> = (state) => state.series;

export const selectorChartsHighlightScopePerSeriesId = createSelector(
  selectSeries,
  (series): Map<SeriesId, Partial<HighlightScope> | undefined> => {
    const map = new Map<SeriesId, Partial<HighlightScope> | undefined>();

    Object.keys(series.processedSeries).forEach((seriesType) => {
      const seriesData = series.processedSeries[seriesType as ChartSeriesType];
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
    return highlight.lastUpdate === 'pointer' ? highlight.item : keyboardItem;
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

export const selectorChartsIsHighlightedCallback = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  createIsHighlighted,
);

export const selectorChartsIsFadedCallback = createSelector(
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
  getSeriesUnfadedItem,
);

export const selectorChartSeriesHighlightedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  getSeriesHighlightedItem,
);

export const selectorChartsIsFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartsIsFaded(highlightScope, highlightedItem, item: HighlightItemData | null) {
    return createIsFaded(highlightScope, highlightedItem)(item);
  },
);
