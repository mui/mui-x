import { createSelector } from 'reselect';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridState } from '../core/gridState';
import { InternalRenderingState } from './renderingState';

export const renderStateSelector = (state: GridState) => state.rendering;
export const scrollStateSelector = createSelector<
  GridState,
  InternalRenderingState,
  GridScrollParams
>(renderStateSelector, (renderingState) => renderingState.realScroll);
