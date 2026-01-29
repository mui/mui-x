import type { MakeOptional } from '@mui/x-internals/types';
import type {
  ChartSeriesType,
  HighlightScope,
  SeriesId,
  SeriesItemIdentifier,
} from '../../../../models/seriesType';

const batchRenderingSeries = new Set(['bar', 'rangeBar', 'line'] as const);
type SeriesTypeWithBatchRendering = typeof batchRenderingSeries extends Set<infer U> ? U : never;


export function isBatchRenderingSeriesType(
  type: ChartSeriesType | undefined,
): type is SeriesTypeWithBatchRendering {
  return batchRenderingSeries.has(type as SeriesTypeWithBatchRendering);
}

export function isSeriesHighlighted<SeriesType extends SeriesTypeWithBatchRendering>(
  scope: Partial<HighlightScope<SeriesType>> | null,
  item: MakeOptional<SeriesItemIdentifier<SeriesType>, 'dataIndex'> | null,
  seriesId: SeriesId,
) {
  return scope?.highlight === 'series' && item?.seriesId === seriesId;
}

export function isSeriesFaded<SeriesType extends SeriesTypeWithBatchRendering>(
  scope: Partial<HighlightScope<SeriesType>> | null,
  item: MakeOptional<SeriesItemIdentifier<SeriesType>, 'dataIndex'> | null,
  seriesId: SeriesId,
) {
  if (isSeriesHighlighted(scope, item, seriesId)) {
    return false;
  }

  return (
    (scope?.fade === 'global' && item != null) ||
    (scope?.fade === 'series' && item?.seriesId === seriesId)
  );
}

/**
 * Returns the data index of the highlighted item for a specific series.
 * If the item is not highlighted, it returns `null`.
 */
export function getSeriesHighlightedDataIndex<SeriesType extends SeriesTypeWithBatchRendering>(
  scope: Partial<HighlightScope<SeriesType>> | null,
  item: MakeOptional<SeriesItemIdentifier<SeriesType>, 'dataIndex'> | null,
  seriesId: SeriesId,
) {
  return scope?.highlight === 'item' && item?.seriesId === seriesId ? item.dataIndex : null;
}

/**
 * Returns the data index of the "unfaded item" for a specific series.
 * An "unfaded item" is the only item of a faded series that shouldn't be faded.
 * If the series is not faded or if there is no highlighted item, it returns `null`.
 */
export function getSeriesUnfadedDataIndex<SeriesType extends SeriesTypeWithBatchRendering>(
  scope: Partial<HighlightScope<SeriesType>> | null,
  item: MakeOptional<SeriesItemIdentifier<SeriesType>, 'dataIndex'> | null,
  seriesId: SeriesId,
) {
  if (isSeriesHighlighted(scope, item, seriesId)) {
    return null;
  }

  if (getSeriesHighlightedDataIndex(scope, item, seriesId) === item?.dataIndex) {
    return null;
  }

  return (scope?.fade === 'series' || scope?.fade === 'global') && item?.seriesId === seriesId
    ? item.dataIndex
    : null;
}
