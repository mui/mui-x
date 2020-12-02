import { createSelector } from 'reselect';
import { Size } from '../../../models/gridOptions';
import { GridState } from '../core/gridState';
import { SizeState } from './sizeState';

export const sizeSelector = (state: GridState) => state.size;

export const sizeValueSelector = createSelector<GridState, SizeState, Size>(
  sizeSelector,
  (size) => size.value,
);

export const sizeRowHeightSelector = createSelector<GridState, SizeState, number>(
  sizeSelector,
  (size) => size.rowHeight,
);

export const sizeHeaderHeightSelector = createSelector<GridState, SizeState, number>(
  sizeSelector,
  (size) => size.headerHeight,
);
