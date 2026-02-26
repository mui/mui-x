import { type HighlightScope, type ChartSeriesType } from '../../../../models/seriesType/config';
import { type HighlightItemData } from './useChartHighlight.types';

function alwaysFalse(): boolean {
  return false;
}

export function createIsFaded<SeriesType extends Exclude<ChartSeriesType, 'sankey'>>(
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemData | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isFaded(item: HighlightItemData | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return (
        item.seriesId === highlightedItem.seriesId && item.dataIndex !== highlightedItem.dataIndex
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        item.seriesId !== highlightedItem.seriesId || item.dataIndex !== highlightedItem.dataIndex
      );
    }

    return false;
  };
}
