import { HighlightItemData, HighlightScope } from './HighlightedContext';

export const createIsFaded =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return (
        input.seriesId === highlightedItem?.seriesId &&
        input.dataIndex !== highlightedItem?.dataIndex
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId ||
        input.dataIndex !== highlightedItem?.dataIndex
      );
    }

    return false;
  };
