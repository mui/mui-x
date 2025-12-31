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

type StateParameters = Pick<ChartState<[UseChartKeyboardNavigationSignature], []>, 'series'>;

export function createGetNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getNextIndexFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | null,
    state: StateParameters,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
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

    const dataLength = processedSeries[type]!.series[seriesId].data.length;
    return {
      type,
      seriesId,
      dataIndex: ((currentItem?.dataIndex ?? -1) + 1) % dataLength,
    };
  };
}

export function createGetPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getPreviousIndexFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,
    state: StateParameters,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
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

    const dataLength = processedSeries[type]!.series[seriesId].data.length;
    return {
      type,
      seriesId,
      dataIndex: (dataLength + (currentItem?.dataIndex ?? 1) - 1) % dataLength,
    };
  };
}

export function createGetNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getNextSeriesFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,

    state: StateParameters,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
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

    const dataLength = processedSeries[type]!.series[seriesId].data.length;

    return {
      type,
      seriesId,
      dataIndex: Math.min(dataLength - 1, currentItem?.dataIndex ?? 0),
    };
  };
}

export function createGetPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return function getPreviousSeriesFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,
    state: StateParameters,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
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

    const dataLength = processedSeries[type]!.series[seriesId].data.length;

    return {
      type,
      seriesId,
      dataIndex: Math.min(dataLength - 1, currentItem?.dataIndex ?? 0),
    };
  };
}
