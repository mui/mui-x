import { createSelector } from 'reselect';
// import { ColDef } from '../../../models/colDef';
import { GridState } from '../core/gridState';
import { ColumnReorderState } from './columnReorderState';

export const columnReorderSelector = (state: GridState) => state.columnReorder;

export const columnReorderDragColSelector = createSelector<GridState, ColumnReorderState, string>(
  columnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
