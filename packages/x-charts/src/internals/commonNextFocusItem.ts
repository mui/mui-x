import { getPreviousNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries';
import type { UseChartKeyboardNavigationSignature } from './plugins/featurePlugins/useChartKeyboardNavigation';
import { getNextNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getNextNonEmptySeries';
import type { ChartState } from './plugins/models/chart';
import { seriesHasData } from './seriesHasData';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { FocusedItemIdentifier, SeriesId, SeriesItemIdentifier } from '../models/seriesType';

type ReturnedItem<OutSeriesType extends ChartSeriesType> = {
  type: OutSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
} | null;

function getNonNullIndex(data: readonly unknown[], step: 1 | -1, startIndex: number): number {
  // Edge case if we arrive on a series with a smaller length than the startIndex
  const clampedStartIndex = Math.min(data.length - 1, startIndex);

  if (data[clampedStartIndex] != null) {
    return clampedStartIndex;
  }

  let nextDataIndex = (data.length + clampedStartIndex + step) % data.length;

  while (data[nextDataIndex] == null && nextDataIndex !== clampedStartIndex) {
    nextDataIndex = (data.length + nextDataIndex + step) % data.length;
  }
  return nextDataIndex;
}

export function createGetNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getNextIndexFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: ChartState<[UseChartKeyboardNavigationSignature], []>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(state);
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType | undefined;
    if (!type || seriesId == null || !seriesHasData(processedSeries, type, seriesId)) {
      const nextSeries = getNextNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (nextSeries === null) {
        return null;
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;
    }

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null ? 0 : (currentItem.dataIndex + 1) % data.length;
    return {
      type,
      seriesId,
      dataIndex: getNonNullIndex(data, 1, startIndex),
    };
  };
}

export function createGetPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getPreviousIndexFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,
    state: ChartState<[UseChartKeyboardNavigationSignature], []>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(state);
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType | undefined;
    if (!type || seriesId == null || !seriesHasData(processedSeries, type, seriesId)) {
      const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (previousSeries === null) {
        return null;
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;
    }

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null
        ? data.length - 1
        : (data.length + currentItem.dataIndex - 1) % data.length;

    return {
      type,
      seriesId,
      dataIndex: getNonNullIndex(data, -1, startIndex),
    };
  };
}

export function createGetNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getNextSeriesFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,

    state: ChartState<[UseChartKeyboardNavigationSignature], []>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(state);
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType;

    const nextSeries = getNextNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
    );

    if (nextSeries === null) {
      return null; // No series to move the focus to.
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex = currentItem?.dataIndex == null ? 0 : currentItem.dataIndex;

    return {
      type,
      seriesId,
      dataIndex: getNonNullIndex(data, 1, startIndex),
    };
  };
}

export function createGetPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getPreviousSeriesFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,
    state: ChartState<[UseChartKeyboardNavigationSignature], []>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(state);
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType;

    const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
    );
    if (previousSeries === null) {
      return null; // No series to move the focus to.
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex = currentItem?.dataIndex == null ? data.length - 1 : currentItem.dataIndex;

    return {
      type,
      seriesId,
      dataIndex: getNonNullIndex(data, -1, startIndex),
    };
  };
}
