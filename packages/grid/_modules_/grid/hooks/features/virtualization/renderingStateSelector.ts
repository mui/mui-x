import { createSelector } from 'reselect';
import { GridScrollParams } from 'packages/grid/data-grid/dist/data-grid';
import { GridState } from '../core/gridState';
import { InternalRenderingState } from './renderingState';

export const renderStateSelector = (state: GridState) => state.rendering;
export const scrollStateSelector = createSelector<
  GridState,
  InternalRenderingState,
  GridScrollParams
>(renderStateSelector, (renderingState) => renderingState.realScroll);
