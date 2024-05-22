import * as React from 'react';
import { HighlightedContext, HighlightedState } from './HighlightedContext';

export function useHighlighted(): HighlightedState {
  return React.useContext(HighlightedContext);
}
