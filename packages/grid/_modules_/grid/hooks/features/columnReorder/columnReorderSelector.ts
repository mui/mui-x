import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { ColumnReorderState } from './columnReorderState';

export const gridColumnReorderSelector = (state: GridState) => state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector<
  GridState,
  ColumnReorderState,
  string
>(gridColumnReorderSelector, (columnReorder) => columnReorder.dragCol);
