import * as React from 'react';
import { HighlightedContext, HighlightedState } from './HighlightedContext';

/**
 * A hook to get the highlighted state of the chart.
 *
 * Please consider using the `useItemHighlighted` hook if you need to check the state of a specific item.
 *
 * @returns {HighlightedState} the state of the chart
 */
export function useHighlighted(): HighlightedState {
  const { isInitialized, data } = React.useContext(HighlightedContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the highlighted ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return data;
}
