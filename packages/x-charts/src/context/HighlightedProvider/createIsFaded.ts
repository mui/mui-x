import { HighlightItemData, HighlightScope } from './HighlightedContext';

export const createIsFaded =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (
      highlightScope.fade === 'same-series' ||
      // @ts-expect-error backward compatibility
      highlightScope.fade === 'series'
    ) {
      return (
        input.seriesId === highlightedItem?.seriesId && input.itemId !== highlightedItem?.itemId
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId || input.itemId !== highlightedItem?.itemId
      );
    }

    return false;
  };
