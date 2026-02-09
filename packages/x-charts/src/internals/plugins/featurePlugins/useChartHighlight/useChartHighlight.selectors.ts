import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import type {
  ChartSeriesType,
  HighlightScope,
  HighlightItemIdentifier,
} from '../../../../models/seriesType';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartHighlightSignature } from './useChartHighlight.types';
import {
  getSeriesHighlightedDataIndex,
  getSeriesUnfadedDataIndex,
  isSeriesFaded,
  isSeriesHighlighted,
  isBatchRenderingSeriesType,
} from './highlightStates';
import { selectorChartsKeyboardItem } from '../useChartKeyboardNavigation';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import {
  type ChartSeriesConfig,
  selectorChartSeriesConfig,
} from '../../corePlugins/useChartSeriesConfig';

const selectHighlight: ChartRootSelector<UseChartHighlightSignature<ChartSeriesType>> = (state) =>
  state.highlight;

type HighlightLookUp<T extends ChartSeriesType> = { [K in T]?: Map<SeriesId, HighlightScope<K>> };

export const selectorChartsHighlightScopePerSeriesId = createSelectorMemoized(
  selectorChartSeriesProcessed,
  (processedSeries): HighlightLookUp<ChartSeriesType> => {
    const map: HighlightLookUp<ChartSeriesType> = {};

    map.bar = new Map<SeriesId, HighlightScope<'bar'>>();
    (Object.keys(processedSeries) as ChartSeriesType[]).forEach(
      <T extends ChartSeriesType>(seriesType: T) => {
        map[seriesType] = new Map();
        const seriesData = processedSeries[seriesType as ChartSeriesType];
        seriesData?.seriesOrder?.forEach((seriesId) => {
          const seriesItem = seriesData?.series[seriesId];
          if (seriesItem?.highlightScope !== undefined) {
            map[seriesType]?.set(seriesId, seriesItem.highlightScope);
          }
        });
      },
    );
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
  function selectorChartsHighlightScope<SeriesType extends ChartSeriesType>(
    seriesIdToHighlightScope: HighlightLookUp<ChartSeriesType>,
    highlightedItem: HighlightItemIdentifier<SeriesType> | null,
  ): HighlightScope<SeriesType> | null {
    if (!highlightedItem) {
      return null;
    }
    const highlightScope = seriesIdToHighlightScope[highlightedItem.type]?.get(
      highlightedItem.seriesId,
    );

    if (highlightScope === undefined) {
      return null;
    }

    return highlightScope;
  },
);
const alwaysFalse = (): boolean => false;

export const selectorChartsIsHighlightedCallback = createSelectorMemoized(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  selectorChartSeriesConfig,
  function selectorChartsIsHighlightedCallback<SeriesType extends ChartSeriesType>(
    highlightScope: HighlightScope<SeriesType> | null,
    highlightedItem: HighlightItemIdentifier<SeriesType> | null,
    seriesConfig: ChartSeriesConfig<SeriesType>,
  ) {
    if (highlightedItem === null || highlightScope === null) {
      return alwaysFalse;
    }
    return seriesConfig[highlightedItem.type as keyof typeof seriesConfig].isHighlightedCreator(
      highlightScope,
      highlightedItem,
    );
  },
);

export const selectorChartsIsFadedCallback = createSelectorMemoized(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  selectorChartSeriesConfig,
  function selectorChartsIsFadedCallback<SeriesType extends ChartSeriesType>(
    highlightScope: HighlightScope<SeriesType> | null,
    highlightedItem: HighlightItemIdentifier<SeriesType> | null,
    seriesConfig: ChartSeriesConfig<SeriesType>,
  ) {
    if (highlightedItem === null || highlightScope === null) {
      return alwaysFalse;
    }
    return seriesConfig[highlightedItem.type as keyof typeof seriesConfig].isFadedCreator(
      highlightScope,
      highlightedItem,
    );
  },
);

export const selectorChartsIsHighlighted = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  selectorChartSeriesConfig,
  function selectorChartsIsHighlighted<SeriesType extends ChartSeriesType>(
    highlightScope: HighlightScope<SeriesType> | null,
    highlightedItem: HighlightItemIdentifier<SeriesType> | null,
    seriesConfig: ChartSeriesConfig<SeriesType>,
    /**
     * The item to test if it's highlighted or not.
     */
    item: HighlightItemIdentifier<ChartSeriesType> | null,
  ) {
    if (highlightedItem === null || highlightScope === null) {
      return false;
    }
    return seriesConfig[highlightedItem.type as keyof typeof seriesConfig].isHighlightedCreator(
      highlightScope,
      highlightedItem,
    )(item);
  },
);

export const selectorChartsIsFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  selectorChartSeriesConfig,
  function selectorChartsIsFaded<SeriesType extends ChartSeriesType>(
    highlightScope: HighlightScope<SeriesType> | null,
    highlightedItem: HighlightItemIdentifier<SeriesType> | null,
    seriesConfig: ChartSeriesConfig<SeriesType>,
    /**
     * The item to test if it's faded or not.
     */
    item: HighlightItemIdentifier<ChartSeriesType> | null,
  ) {
    if (highlightedItem === null || highlightScope === null) {
      return false;
    }
    return seriesConfig[highlightedItem.type as keyof typeof seriesConfig].isFadedCreator(
      highlightScope,
      highlightedItem,
    )(item);
  },
);

// ==========================================================================================
//
// Selectors for a specific series
//
// Those selectors are for series with batch rendering (e.g., Scatter, Bar, Line)
//
// ==========================================================================================

export const selectorChartIsSeriesHighlighted = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartIsSeriesHighlighted<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifier<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    if (!isBatchRenderingSeriesType(item?.type)) {
      return false;
    }
    return isSeriesHighlighted(scope, item, seriesId);
  },
);

export const selectorChartIsSeriesFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartIsSeriesFaded<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifier<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    if (!isBatchRenderingSeriesType(item?.type)) {
      return false;
    }
    return isSeriesFaded(scope, item, seriesId);
  },
);

export const selectorChartSeriesUnfadedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartSeriesUnfadedItem<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifier<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    if (!isBatchRenderingSeriesType(item?.type)) {
      return null;
    }
    return getSeriesUnfadedDataIndex(scope, item, seriesId);
  },
);

export const selectorChartSeriesHighlightedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartSeriesHighlightedItem<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifier<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    if (!isBatchRenderingSeriesType(item?.type)) {
      return null;
    }
    return getSeriesHighlightedDataIndex(scope, item, seriesId);
  },
);
