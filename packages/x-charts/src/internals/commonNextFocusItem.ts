import { getPreviousNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries';
import { getMaxSeriesLength } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getMaxSeriesLength';
import type { UseChartKeyboardNavigationSignature } from './plugins/featurePlugins/useChartKeyboardNavigation';
import { getNextNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getNextNonEmptySeries';
import type { ChartState } from './plugins/models/chart';
import { seriesHasData } from './seriesHasData';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { FocusedItemIdentifier, SeriesId, SeriesItemIdentifier } from '../models/seriesType';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';

type ReturnedItem<OutSeriesType extends ChartSeriesType> = {
  type: OutSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
} | null;

type StateParameters<TSeriesType extends ChartSeriesType> = Pick<
  ChartState<[UseChartKeyboardNavigationSignature], [], TSeriesType>,
  'series'
>;

type NavigationDirection = 'next' | 'previous';

function getProcessedSeries<TSeriesType extends ChartSeriesType>(
  state: StateParameters<TSeriesType>,
) {
  return selectorChartSeriesProcessed(
    state as ChartState<[UseChartKeyboardNavigationSignature], []>,
  );
}

function findNonEmptySeries<OutSeriesType extends Exclude<ChartSeriesType, 'sankey'>>(
  direction: NavigationDirection,
  processedSeries: ReturnType<typeof selectorChartSeriesProcessed>,
  compatibleSeriesTypes: Set<OutSeriesType>,
  type: OutSeriesType | undefined,
  seriesId: SeriesId | undefined,
) {
  if (direction === 'next') {
    return getNextNonEmptySeries(processedSeries, compatibleSeriesTypes, type, seriesId);
  }

  return getPreviousNonEmptySeries(processedSeries, compatibleSeriesTypes, type, seriesId);
}

// --- Index navigation (moves dataIndex within a series) ---

export function createGetNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>, allowCycles: boolean = false) {
  return createGetIndexFocusedItem<InSeriesType, OutSeriesType>(
    compatibleSeriesTypes,
    'next',
    allowCycles,
  );
}

export function createGetPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>, allowCycles: boolean = false) {
  return createGetIndexFocusedItem<InSeriesType, OutSeriesType>(
    compatibleSeriesTypes,
    'previous',
    allowCycles,
  );
}

function createGetIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>, direction: NavigationDirection, allowCycles: boolean) {
  const isNext = direction === 'next';

  return function getIndexFocusedItem(
    currentItem: FocusedItemIdentifier<InSeriesType> | SeriesItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = getProcessedSeries(state);

    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType | undefined;

    if (!type || seriesId == null || !seriesHasData(processedSeries, type, seriesId)) {
      const resolved = findNonEmptySeries(
        direction,
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );

      if (resolved === null) {
        return null;
      }

      type = resolved.type;
      seriesId = resolved.seriesId;
    }

    const maxLength = getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    let dataIndex: number;

    if (currentItem?.dataIndex == null) {
      dataIndex = isNext ? 0 : maxLength - 1;
    } else {
      dataIndex = currentItem.dataIndex + (isNext ? 1 : -1);
    }

    if (allowCycles) {
      dataIndex = (maxLength + dataIndex) % maxLength;
    } else {
      dataIndex = isNext ? Math.min(maxLength - 1, dataIndex) : Math.max(0, dataIndex);
    }

    return { type, seriesId, dataIndex };
  };
}

// --- Series navigation (moves between series, preserving dataIndex) ---

export function createGetNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return createGetSeriesFocusedItem<InSeriesType, OutSeriesType>(compatibleSeriesTypes, 'next');
}

export function createGetPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>) {
  return createGetSeriesFocusedItem<InSeriesType, OutSeriesType>(compatibleSeriesTypes, 'previous');
}

function createGetSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = InSeriesType,
>(compatibleSeriesTypes: Set<OutSeriesType>, direction: NavigationDirection) {
  return function getSeriesFocusedItem(
    currentItem: SeriesItemIdentifier<InSeriesType> | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = getProcessedSeries(state);

    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type as OutSeriesType;

    const resolved = findNonEmptySeries(
      direction,
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
    );

    if (resolved === null) {
      return null;
    }

    type = resolved.type;
    seriesId = resolved.seriesId;

    let dataIndex: number;

    if (currentItem?.dataIndex == null) {
      dataIndex =
        direction === 'next' ? 0 : processedSeries[type]!.series[seriesId].data.length - 1;
    } else {
      dataIndex = currentItem.dataIndex;
    }

    return { type, seriesId, dataIndex };
  };
}

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  | ('rangeBar' extends ChartSeriesType ? 'rangeBar' : never);

export const composableCartesianSeriesTypes: Set<ComposableCartesianChartSeriesType> = new Set([
  'bar',
  'line',
  'scatter',
  'rangeBar',
] as ComposableCartesianChartSeriesType[]);
