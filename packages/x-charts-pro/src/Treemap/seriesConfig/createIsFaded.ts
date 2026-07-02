import type { HighlightItemIdentifierWithType } from '@mui/x-charts/models';
import type { TreemapHighlightScope } from '../treemap.highlight.types';
import { createTreemapIsHighlighted } from './createIsHighlighted';

const DEFAULT_FADE = 'none';

function alwaysFalse(): boolean {
  return false;
}

export function createTreemapIsFaded(
  highlightScope: TreemapHighlightScope | null | undefined,
  highlightedItem: HighlightItemIdentifierWithType<'treemap'> | null,
) {
  if (!highlightedItem) {
    return alwaysFalse;
  }

  const fade = highlightScope?.fade ?? DEFAULT_FADE;
  const isHighlighted = createTreemapIsHighlighted(highlightScope, highlightedItem);

  return function isFaded(item: HighlightItemIdentifierWithType<'treemap'> | null): boolean {
    if (!item || item.type !== 'treemap') {
      return false;
    }

    if (isHighlighted(item)) {
      return false;
    }

    return fade === 'global';
  };
}
