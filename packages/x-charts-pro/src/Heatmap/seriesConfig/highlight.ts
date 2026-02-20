import type { HighlightScope } from '@mui/x-charts/context';
import type { HighlightItemIdentifier } from '@mui/x-charts/models';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isHighlighted logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsHighlighted(
  highlightScope: HighlightScope<'heatmap'> | null | undefined,
  highlightedItem: HighlightItemIdentifier<'heatmap'> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted(item: HighlightItemIdentifier<'heatmap'> | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return item.seriesId === highlightedItem.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        item.xIndex === highlightedItem.xIndex &&
        item.yIndex === highlightedItem.yIndex &&
        item.seriesId === highlightedItem.seriesId
      );
    }

    return false;
  };
}

/**
 * The isFade logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsFaded(
  highlightScope: HighlightScope<'heatmap'> | null | undefined,
  highlightedItem: HighlightItemIdentifier<'heatmap'> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isFaded(item: HighlightItemIdentifier<'heatmap'> | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return (
        item.seriesId === highlightedItem.seriesId &&
        (item.xIndex !== highlightedItem.xIndex || item.yIndex !== highlightedItem.yIndex)
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        item.seriesId !== highlightedItem.seriesId ||
        item.xIndex !== highlightedItem.xIndex ||
        item.yIndex !== highlightedItem.yIndex
      );
    }

    return false;
  };
}
