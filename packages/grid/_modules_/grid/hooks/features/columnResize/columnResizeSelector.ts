import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridColumnResizeState } from './columnResizeState';

export const gridColumnResizeSelector = (state: GridState) => state.columnResize;

export const gridResizingColumnFieldSelector = createSelector<
  GridState,
  GridColumnResizeState,
  string
>(gridColumnResizeSelector, (columnResize) => columnResize.resizingColumnField);
