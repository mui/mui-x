import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models/seriesType/common';
import type { HighlightItemIdentifierWithType } from '../../../../models/seriesType';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';
import type { ComposableChartSeriesType } from '../../../../models/seriesType/composition';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartHighlightSignature } from './useChartHighlight.types';
import {
  getSeriesHighlightedDataIndex,
  getSeriesUnfadedDataIndex,
  isSeriesFaded,
  isSeriesHighlighted,
} from './highlightStates';
import { selectorChartsKeyboardItem } from '../useChartKeyboardNavigation';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import {
  type ChartSeriesConfig,
  selectorChartSeriesConfig,
} from '../../corePlugins/useChartSeriesConfig';
import { type HighlightState } from '../../../../hooks/useItemHighlightState';

const selectHighlight: ChartRootSelector<UseChartHighlightSignature<ChartSeriesType>> = (state) =>
  state.highlight;

type HighlightLookUp<SeriesType extends ChartSeriesType> = {
  [K in SeriesType]?: Map<SeriesId, HighlightScope<K>>;
};

export const selectorChartsHighlightScopePerSeriesId = createSelectorMemoized(
  selectorChartSeriesProcessed,
  (processedSeries): HighlightLookUp<ChartSeriesType> => {
    const map: HighlightLookUp<ChartSeriesType> = {};

    (Object.keys(processedSeries) as ChartSeriesType[]).forEach(
      <SeriesType extends ChartSeriesType>(seriesType: SeriesType) => {
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
    highlightedItem: HighlightItemIdentifierWithType<SeriesType> | null,
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
const alwaysNone = (): HighlightState => 'none';

const selectorChartsHighlightStateCallbackImpl = createSelectorMemoized(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  selectorChartSeriesConfig,
  function selectorChartsHighlightStateCallbackCombiner<SeriesType extends ChartSeriesType>(
    highlightScope: HighlightScope<SeriesType> | null,
    highlightedItem: HighlightItemIdentifierWithType<SeriesType> | null,
    seriesConfig: ChartSeriesConfig<SeriesType>,
  ): (
    item: HighlightItemIdentifierWithType<ComposableChartSeriesType<SeriesType>> | null,
  ) => HighlightState {
    if (highlightedItem === null || highlightScope === null) {
      return alwaysNone;
    }
    const config = seriesConfig[highlightedItem.type as keyof typeof seriesConfig];
    const isHighlighted = config.isHighlightedCreator(highlightScope, highlightedItem);
    const isFaded = config.isFadedCreator(highlightScope, highlightedItem);
    return (item) => {
      if (isHighlighted(item)) {
        return 'highlighted';
      }
      if (isFaded(item)) {
        return 'faded';
      }
      return 'none';
    };
  },
);

/**
 * Returns a callback to get the highlight state of an item.
 * Uses an explicit function declaration so that TypeScript preserves
 * the `HighlightItemIdentifier<ChartSeriesType>` reference in `.d.ts` output,
 * allowing module augmentation from pro/premium packages to extend the accepted types.
 */
export function selectorChartsHighlightStateCallback<SeriesType extends ChartSeriesType>(
  state: Parameters<typeof selectorChartsHighlightStateCallbackImpl>[0],
): (
  item: HighlightItemIdentifierWithType<ComposableChartSeriesType<SeriesType>> | null,
) => HighlightState {
  return selectorChartsHighlightStateCallbackImpl(state);
}

const selectorChartsHighlightStateImpl = createSelectorMemoized(
  selectorChartsHighlightStateCallback,
  function selectorChartsHighlightStateCombiner<SeriesType extends ChartSeriesType>(
    getHighlightState: (
      item: HighlightItemIdentifierWithType<ComposableChartSeriesType<SeriesType>> | null,
    ) => HighlightState,
    item: HighlightItemIdentifierWithType<ComposableChartSeriesType<SeriesType>> | null,
  ): HighlightState {
    return getHighlightState(item);
  },
);

/**
 * Returns the highlight state of an item.
 * Uses an explicit function declaration so that TypeScript preserves
 * the `HighlightItemIdentifier<ChartSeriesType>` reference in `.d.ts` output,
 * allowing module augmentation from pro/premium packages to extend the accepted types.
 */
export function selectorChartsHighlightState(
  state: Parameters<typeof selectorChartsHighlightStateImpl>[0],
  item: Parameters<typeof selectorChartsHighlightStateImpl>[1],
): HighlightState {
  return selectorChartsHighlightStateImpl(state, item);
}

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
    item: HighlightItemIdentifierWithType<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    return isSeriesHighlighted(scope, item, seriesId);
  },
);

export const selectorChartIsSeriesFaded = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartIsSeriesFaded<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifierWithType<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    return isSeriesFaded(scope, item, seriesId);
  },
);

export const selectorChartSeriesUnfadedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartSeriesUnfadedItem<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifierWithType<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    return getSeriesUnfadedDataIndex(scope, item, seriesId);
  },
);

export const selectorChartSeriesHighlightedItem = createSelector(
  selectorChartsHighlightScope,
  selectorChartsHighlightedItem,
  function selectorChartSeriesHighlightedItem<SeriesType extends ChartSeriesType>(
    scope: Partial<HighlightScope<SeriesType>> | null,
    item: HighlightItemIdentifierWithType<SeriesType> | null,
    seriesId: SeriesId,
  ) {
    return getSeriesHighlightedDataIndex(scope, item, seriesId);
  },
);
