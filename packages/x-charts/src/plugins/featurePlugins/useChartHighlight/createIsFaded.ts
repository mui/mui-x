import { HighlightScope } from './highlightConfig.types';
import { HighlightItemData } from './useChartHighlight.types';

function alwaysFalse(): boolean {
  return false;
}

export function createIsFaded(
  highlightScope: HighlightScope | null | undefined,
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
