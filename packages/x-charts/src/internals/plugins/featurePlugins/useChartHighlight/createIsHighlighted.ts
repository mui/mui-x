import { HighlightScope } from './highlightConfig.types';
import { HighlightItemData } from './useChartHighlight.types';

export const createIsHighlighted =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (item: HighlightItemData | null): boolean => {
    if (!highlightScope || !highlightedItem || !item) {
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
