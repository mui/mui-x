import { createSelector } from '../../../utils/createSelector';
import { GridState } from '../../../models/gridState';

export const gridColumnReorderSelector = (state: GridState) => state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
