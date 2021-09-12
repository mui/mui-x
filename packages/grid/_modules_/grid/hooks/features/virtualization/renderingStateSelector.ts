import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';

export const gridRenderingSelector = (state: GridState) => state.rendering;

export const gridScrollSelector = createSelector(
  gridRenderingSelector,
  (renderingState) => renderingState.realScroll,
);
