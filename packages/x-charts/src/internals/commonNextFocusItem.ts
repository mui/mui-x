import { getPreviousNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries';
import { getMaxSeriesLength } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getMaxSeriesLength';
import type { UseChartKeyboardNavigationSignature } from './plugins/featurePlugins/useChartKeyboardNavigation';
import { getNextNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getNextNonEmptySeries';
import { findVisibleDataIndex } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/findVisibleDataIndex';
import type { ChartState } from './plugins/models/chart';
import { seriesHasData } from './seriesHasData';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId, FocusedItemIdentifier } from '../models/seriesType';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import {
  selectorIsItemVisibleGetter,
  type UseChartVisibilityManagerSignature,
} from './plugins/featurePlugins/useChartVisibilityManager';

type ReturnedItem<OutSeriesType extends ChartSeriesType> = {
  type: OutSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
} | null;

type StateParameters<SeriesType extends ChartSeriesType> = Pick<
  ChartState<
    [UseChartKeyboardNavigationSignature],
    [UseChartVisibilityManagerSignature<SeriesType>],
    SeriesType
  >,
  'series' | 'visibilityManager'
>;
export function createGetNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, allows cycling from the last item to the first one.
   */
  allowCycles: boolean = false,
) {
  return function getNextIndexFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as unknown as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const isItemVisible = selectorIsItemVisibleGetter(
      state as unknown as ChartState<[UseChartVisibilityManagerSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      !isItemVisible({ type, seriesId })
    ) {
      const nextSeries = getNextNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
        isItemVisible,
      );
      if (nextSeries === null) {
        return null;
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;
    }

    const maxLength = getMaxSeriesLength(processedSeries, compatibleSeriesTypes, isItemVisible);

    if (maxLength === 0) {
      return null;
    }

    let dataIndex = currentItem?.dataIndex == null ? 0 : currentItem.dataIndex + 1;
    if (allowCycles) {
      dataIndex = dataIndex % maxLength;
    } else {
      dataIndex = Math.min(maxLength - 1, dataIndex);
    }

    const visibleDataIndex = findVisibleDataIndex({
      type,
      seriesId,
      startIndex: dataIndex,
      dataLength: maxLength,
      direction: 1,
      allowCycles,
      isItemVisible,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, allows cycling from the last item to the first one.
   */
  allowCycles: boolean = false,
) {
  return function getPreviousIndexFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as unknown as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const isItemVisible = selectorIsItemVisibleGetter(
      state as unknown as ChartState<[UseChartVisibilityManagerSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      !isItemVisible({ type, seriesId })
    ) {
      const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
        isItemVisible,
      );
      if (previousSeries === null) {
        return null;
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;
    }

    const maxLength = getMaxSeriesLength(processedSeries, compatibleSeriesTypes, isItemVisible);

    if (maxLength === 0) {
      return null;
    }

    let dataIndex = currentItem?.dataIndex == null ? maxLength - 1 : currentItem.dataIndex - 1;
    if (allowCycles) {
      dataIndex = (maxLength + dataIndex) % maxLength;
    } else {
      dataIndex = Math.max(0, dataIndex);
    }

    const visibleDataIndex = findVisibleDataIndex({
      type,
      seriesId,
      startIndex: dataIndex,
      dataLength: maxLength,
      direction: -1,
      allowCycles,
      isItemVisible,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getNextSeriesFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as unknown as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const isItemVisible = selectorIsItemVisibleGetter(
      state as unknown as ChartState<[UseChartVisibilityManagerSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;

    const nextSeries = getNextNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
      isItemVisible,
    );

    if (nextSeries === null) {
      return null; // No series to move the focus to.
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;

    const data = processedSeries[type as OutSeriesType]!.series[seriesId].data;
    const startIndex = currentItem?.dataIndex == null ? 0 : currentItem.dataIndex;
    const visibleDataIndex = findVisibleDataIndex({
      type,
      seriesId,
      startIndex: Math.min(startIndex, data.length - 1),
      dataLength: data.length,
      direction: 1,
      allowCycles: true,
      isItemVisible,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getPreviousSeriesFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as unknown as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const isItemVisible = selectorIsItemVisibleGetter(
      state as unknown as ChartState<[UseChartVisibilityManagerSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;

    const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
      isItemVisible,
    );
    if (previousSeries === null) {
      return null; // No series to move the focus to.
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;

    const data = processedSeries[type as OutSeriesType]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null
        ? data.length - 1
        : Math.min(currentItem.dataIndex, data.length - 1);
    const visibleDataIndex = findVisibleDataIndex({
      type,
      seriesId,
      startIndex,
      dataLength: data.length,
      direction: -1,
      allowCycles: true,
      isItemVisible,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}
