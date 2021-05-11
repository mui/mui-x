import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridColumnReorderState } from './columnReorderState';

export const gridColumnReorderSelector = (state: GridState) => state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector<
  GridState,
  GridColumnReorderState,
  string
>(gridColumnReorderSelector, (columnReorder) => columnReorder.dragCol);
