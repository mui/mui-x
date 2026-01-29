import type { ChartSeriesType } from '@mui/x-charts/internals';
import type { SeriesItemIdentifier } from '@mui/x-charts/models';import type { SankeyHighlightScope } from '../sankey.highlight.types';
import type { SankeyItemIdentifier } from '../sankey.types';
import { createSankeyIsHighlighted } from './createIsHighlighted';

const DEFAULT_FADE = 'none';

function alwaysFalse(): boolean {
  return false;
}

export function createSankeyIsFaded(
  highlightScope: SankeyHighlightScope | null | undefined,
  highlightedItem: SankeyItemIdentifier | null,
) {
  if (!highlightedItem) {
    return alwaysFalse;
  }

  const nodeFade = highlightScope?.nodes?.fade ?? DEFAULT_FADE;
  const linkFade = highlightScope?.links?.fade ?? DEFAULT_FADE;

  const isHighlighted = createSankeyIsHighlighted(highlightScope, highlightedItem);

  return function isFaded(item: SeriesItemIdentifier<ChartSeriesType> | null): boolean {
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
