import type { ChartSeriesType } from '@mui/x-charts/internals';
import type { HighlightItemIdentifierWithType } from '@mui/x-charts/models';
import type { TreemapHighlightScope } from '../treemap.highlight.types';

const DEFAULT_HIGHLIGHT = 'node';

function alwaysFalse(): boolean {
  return false;
}

export function createTreemapIsHighlighted(
  highlightScope: TreemapHighlightScope | null | undefined,
  highlightedItem: HighlightItemIdentifierWithType<'treemap'> | null,
) {
  if (!highlightedItem) {
    return alwaysFalse;
  }

  const highlight = highlightScope?.highlight ?? DEFAULT_HIGHLIGHT;

  return function isHighlighted(
    item: HighlightItemIdentifierWithType<ChartSeriesType> | null,
  ): boolean {
    if (!item || item.type !== 'treemap' || highlight === 'none') {
      return false;
    }

    return item.nodeId === highlightedItem.nodeId;
  };
}
