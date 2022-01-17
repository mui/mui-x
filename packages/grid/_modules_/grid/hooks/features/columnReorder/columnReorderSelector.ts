import { createSelector } from 'reselect';
import { GridStatePro } from '../../../models/gridState';

export const gridColumnReorderSelector = (state: GridStatePro) => state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
