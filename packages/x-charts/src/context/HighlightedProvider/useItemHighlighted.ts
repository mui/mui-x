import * as React from 'react';
import { HighlightedContext, HighlightItemData } from './HighlightedContext';

export function useItemHighlighted(item: HighlightItemData | null): {
  isHighlighted: boolean;
  isFaded: boolean;
} {
  const highlighted = React.useContext(HighlightedContext);

  if (highlighted === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the highlighted ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  if (!item) {
    return {
      isHighlighted: false,
      isFaded: false,
    };
  }

  const isHighlighted = highlighted.isHighlighted(item);
  const isFaded = !isHighlighted && highlighted.isFaded(item);

  return { isHighlighted, isFaded };
}
