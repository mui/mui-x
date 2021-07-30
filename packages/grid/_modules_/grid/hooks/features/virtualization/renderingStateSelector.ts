import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';

export const renderStateSelector = (state: GridState) => state.rendering;

export const scrollStateSelector = createSelector(
  renderStateSelector,
  (renderingState) => renderingState.realScroll,
);
