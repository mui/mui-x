import { HighlightScope } from './highlightConfig.types';
import { HighlightItemData } from './useChartHighlight.types';

export const createIsFaded =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (item: HighlightItemData | null): boolean => {
    if (!highlightScope || !highlightedItem || !item) {
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
