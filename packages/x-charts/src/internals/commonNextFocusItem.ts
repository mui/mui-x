import { getPreviousNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries';
import { getMaxSeriesLength } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getMaxSeriesLength';
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

    const maxLength = getMaxSeriesLength(processedSeries, compatibleSeriesTypes);
    const dataIndex = Math.min(
      maxLength - 1,
      currentItem?.dataIndex == null ? 0 : currentItem.dataIndex + 1,
    );
    return {
      type,
      seriesId,
      dataIndex,
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

    const maxLength = getMaxSeriesLength(processedSeries, compatibleSeriesTypes);
    const dataIndex = Math.max(
      0,
      currentItem?.dataIndex == null ? maxLength - 1 : currentItem.dataIndex - 1,
    );

    return {
      type,
      seriesId,
      dataIndex,
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

    const dataIndex = currentItem?.dataIndex == null ? 0 : currentItem.dataIndex;

    return {
      type,
      seriesId,
      dataIndex,
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

    const data = processedSeries[type]!.series[seriesId].data;
    const dataIndex = currentItem?.dataIndex == null ? data.length - 1 : currentItem.dataIndex;

    return {
      type,
      seriesId,
      dataIndex,
    };
  };
}
