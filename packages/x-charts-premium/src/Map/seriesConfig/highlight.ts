import type { HighlightScope } from '@mui/x-charts/context';
import type { HighlightItemIdentifier } from '@mui/x-charts/models';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isHighlighted logic for main charts (those that are identified by an id and a name)
 */
export function createIsHighlighted(
  highlightScope: HighlightScope<'mapShape'> | null | undefined,
  highlightedItem: HighlightItemIdentifier<'mapShape'> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted(item: HighlightItemIdentifier<'mapShape'> | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return item.seriesId === highlightedItem.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return item.name === highlightedItem.name && item.seriesId === highlightedItem.seriesId;
    }

    return false;
  };
}

/**
 * The isFade logic for main charts (those that are identified by an id and a name)
 */
export function createIsFaded(
  highlightScope: HighlightScope<'mapShape'> | null | undefined,
  highlightedItem: HighlightItemIdentifier<'mapShape'> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isFaded(item: HighlightItemIdentifier<'mapShape'> | null): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return item.seriesId === highlightedItem.seriesId && item.name !== highlightedItem.name;
    }

    if (highlightScope.fade === 'global') {
      return item.seriesId !== highlightedItem.seriesId || item.name !== highlightedItem.name;
    }

    return false;
  };
}
