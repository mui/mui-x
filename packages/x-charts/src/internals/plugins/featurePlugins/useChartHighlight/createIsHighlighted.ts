import { type HighlightScope } from './highlightConfig.types';
import { type HighlightItemData } from './useChartHighlight.types';

function alwaysFalse(): boolean {
  return false;
}

export function createIsHighlighted(
  highlightScope: HighlightScope | null | undefined,
  highlightedItem: HighlightItemData | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted(item: HighlightItemData | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return item.seriesId === highlightedItem.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        item.dataIndex === highlightedItem.dataIndex && item.seriesId === highlightedItem.seriesId
      );
    }

    return false;
  };
}
