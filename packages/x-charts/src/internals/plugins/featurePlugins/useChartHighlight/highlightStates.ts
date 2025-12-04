import { HighlightItemData } from './useChartHighlight.types';
import { HighlightScope } from './highlightConfig.types';
import { SeriesId } from '../../../../models/seriesType/common';

export function isSeriesHighlighted(
  scope: Partial<HighlightScope> | null,
  item: HighlightItemData | null,
  seriesId: SeriesId,
) {
  return scope?.highlight === 'series' && item?.seriesId === seriesId;
}

export function isSeriesFaded(
  scope: Partial<HighlightScope> | null,
  item: HighlightItemData | null,
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
export function getSeriesHighlightedItem(
  scope: Partial<HighlightScope> | null,
  item: HighlightItemData | null,
  seriesId: SeriesId,
) {
  return scope?.highlight === 'item' && item?.seriesId === seriesId ? item.dataIndex : null;
}

/**
 * Returns the data index of the "unfaded item" for a specific series.
 * An "unfaded item" is the only item of a faded series that shouldn't be faded.
 * If the series is not faded or if there is no highlighted item, it returns `null`.
 */
export function getSeriesUnfadedItem(
  scope: Partial<HighlightScope> | null,
  item: HighlightItemData | null,
  seriesId: SeriesId,
) {
  if (isSeriesHighlighted(scope, item, seriesId)) {
    return null;
  }

  if (getSeriesHighlightedItem(scope, item, seriesId) === item?.dataIndex) {
    return null;
  }

  return (scope?.fade === 'series' || scope?.fade === 'global') && item?.seriesId === seriesId
    ? item.dataIndex
    : null;
}
