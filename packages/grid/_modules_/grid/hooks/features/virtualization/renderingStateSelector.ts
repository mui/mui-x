import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';

export const gridRenderStateSelector = (state: GridState) => state.rendering;

export const gridScrollStateSelector = createSelector(
  gridRenderStateSelector,
  (renderingState) => renderingState.realScroll,
);
