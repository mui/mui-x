import { getPreviousSeriesWithData } from './getPreviousSeriesWithData';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries';
import type { UseChartKeyboardNavigationSignature } from './plugins/featurePlugins/useChartKeyboardNavigation';
import { getNextSeriesWithData } from './getNextSeriesWithData';
import type { ChartState } from './plugins/models/chart';
import { seriesHasData } from './seriesHasData';
import type { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId } from '../models/seriesType/common';

type ReturnedItem<OutSeriesType extends ChartSeriesType> = {
  type: OutSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
} | null;

export function getNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
>(
  currentItem: ChartItemIdentifier<InSeriesType> | null,
  compatibleSeriesTypes: Set<OutSeriesType>,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
): ReturnedItem<OutSeriesType> {
  const processedSeries = selectorChartSeriesProcessed(state);
  let seriesId = currentItem?.seriesId;
  let type = currentItem?.type as OutSeriesType | undefined;
  if (!type || seriesId == null || !seriesHasData(processedSeries, type, seriesId)) {
    const nextSeries = getNextSeriesWithData<OutSeriesType>(
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
}

export function getPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends InSeriesType | Exclude<ChartSeriesType, 'sankey'>,
>(
  currentItem: ChartItemIdentifier<InSeriesType> | null,
  compatibleSeriesTypes: Set<OutSeriesType>,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
): ReturnedItem<OutSeriesType> {
  const processedSeries = selectorChartSeriesProcessed(state);
  let seriesId = currentItem?.seriesId;
  let type = currentItem?.type as OutSeriesType | undefined;
  if (!type || seriesId == null || !seriesHasData(processedSeries, type, seriesId)) {
    const previousSeries = getPreviousSeriesWithData<OutSeriesType>(
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
}

export function getNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends InSeriesType | Exclude<ChartSeriesType, 'sankey'>,
>(
  currentItem: ChartItemIdentifier<InSeriesType> | null,
  compatibleSeriesTypes: Set<OutSeriesType>,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
): ReturnedItem<OutSeriesType> {
  const processedSeries = selectorChartSeriesProcessed(state);
  let seriesId = currentItem?.seriesId;
  let type = currentItem?.type as OutSeriesType | undefined;

  const nextSeries = getNextSeriesWithData<OutSeriesType>(
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
}

export function getPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutSeriesType extends InSeriesType | Exclude<ChartSeriesType, 'sankey'>,
>(
  currentItem: ChartItemIdentifier<InSeriesType> | null,
  compatibleSeriesTypes: Set<OutSeriesType>,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
): ReturnedItem<OutSeriesType> {
  const processedSeries = selectorChartSeriesProcessed(state);
  let seriesId = currentItem?.seriesId;
  let type = currentItem?.type as OutSeriesType | undefined;

  const previousSeries = getPreviousSeriesWithData<OutSeriesType>(
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
}
