import * as React from 'react';
import { HighlightedContext, HighlightedState } from './HighlightedContext';

export function useHighlighted(): HighlightedState {
  const highlighted = React.useContext(HighlightedContext);

  if (highlighted === undefined) {
    throw new Error(
      [
        'MUI X: Could not find the highlighted ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return highlighted;
}
