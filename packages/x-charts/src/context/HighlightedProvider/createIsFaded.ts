import { HighlightItemData, HighlightScope } from './HighlightedContext';
import { isPathEqual } from './isPathEqual';

export const createIsFaded =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return (
        input.seriesId === highlightedItem?.seriesId &&
        !isPathEqual(input.path, highlightedItem?.path)
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId ||
        !isPathEqual(input.path, highlightedItem?.path)
      );
    }

    return false;
  };
