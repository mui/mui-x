import { HighlightItemData, HighlightScope } from './HighlightedContext';
import { isPathEqual } from './isPathEqual';

export const createIsHighlighted =
  (highlightScope: HighlightScope | null | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (
      highlightScope.highlight === 'same-series' ||
      // @ts-expect-error backward compatibility
      highlightScope.highlight === 'series'
    ) {
      return input.seriesId === highlightedItem?.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        isPathEqual(input.path, highlightedItem?.path) &&
        input.seriesId === highlightedItem?.seriesId
      );
    }

    return false;
  };
