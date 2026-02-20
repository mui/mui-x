import type { HighlightItemIdentifier } from '@mui/x-charts/models';
import type { SankeyHighlightScope } from '../sankey.highlight.types';
import { createSankeyIsHighlighted } from './createIsHighlighted';

const DEFAULT_FADE = 'none';

function alwaysFalse(): boolean {
  return false;
}

export function createSankeyIsFaded(
  highlightScope: SankeyHighlightScope | null | undefined,
  highlightedItem: HighlightItemIdentifier<'sankey'> | null,
) {
  if (!highlightedItem) {
    return alwaysFalse;
  }

  const nodeFade = highlightScope?.nodes?.fade ?? DEFAULT_FADE;
  const linkFade = highlightScope?.links?.fade ?? DEFAULT_FADE;

  const isHighlighted = createSankeyIsHighlighted(highlightScope, highlightedItem);

  return function isFaded(item: HighlightItemIdentifier<'sankey'> | null): boolean {
    if (!item || item.type !== 'sankey') {
      return false;
    }

    if (isHighlighted(item)) {
      return false;
    }

    const fadeMode = highlightedItem.subType === 'node' ? nodeFade : linkFade;

    return fadeMode === 'global';
  };
}
