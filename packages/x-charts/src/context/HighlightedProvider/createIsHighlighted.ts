import { HighlightItemData, HighlightScope } from './HighlightedContext';

export const createIsHighlighted =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return input.seriesId === highlightedItem?.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        input.dataIndex === highlightedItem?.dataIndex &&
        input.seriesId === highlightedItem?.seriesId
      );
    }

    return false;
  };
