import { SeriesId } from '../../../../models/seriesType/common';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { ChartRootSelector, createChartSelector } from '../../utils/selectors';
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

export const selectorChartsHighlightScopePerSeriesId = createChartSelector(
  [selectSeries],
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

export const selectorChartsHighlightedItem = createChartSelector(
  [selectHighlight, selectorChartsKeyboardItem],
  function selectorChartsHighlightedItem(highlight, keyboardItem) {
    return highlight.lastUpdate === 'pointer' ? highlight.item : keyboardItem;
  },
);

export const selectorChartsHighlightScope = createChartSelector(
  [selectorChartsHighlightScopePerSeriesId, selectorChartsHighlightedItem],
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

export const selectorChartsIsHighlightedCallback = createChartSelector(
  [selectorChartsHighlightScope, selectorChartsHighlightedItem],
  createIsHighlighted,
);

export const selectorChartsIsFadedCallback = createChartSelector(
  [selectorChartsHighlightScope, selectorChartsHighlightedItem],
  createIsFaded,
);

export const selectorChartsIsHighlighted = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, item: HighlightItemData | null) => item,
  ],
  function selectorChartsIsHighlighted(highlightScope, highlightedItem, item) {
    return createIsHighlighted(highlightScope, highlightedItem)(item);
  },
);

export const selectorChartIsSeriesHighlighted = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, seriesId: SeriesId) => seriesId,
  ],
  isSeriesHighlighted,
);

export const selectorChartIsSeriesFaded = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, seriesId: SeriesId) => seriesId,
  ],
  isSeriesFaded,
);

export const selectorChartSeriesUnfadedItem = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, seriesId: SeriesId) => seriesId,
  ],
  getSeriesUnfadedItem,
);

export const selectorChartSeriesHighlightedItem = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, seriesId: SeriesId) => seriesId,
  ],
  getSeriesHighlightedItem,
);

export const selectorChartsIsFaded = createChartSelector(
  [
    selectorChartsHighlightScope,
    selectorChartsHighlightedItem,
    (_, item: HighlightItemData | null) => item,
  ],
  function selectorChartsIsFaded(highlightScope, highlightedItem, item) {
    return createIsFaded(highlightScope, highlightedItem)(item);
  },
);
