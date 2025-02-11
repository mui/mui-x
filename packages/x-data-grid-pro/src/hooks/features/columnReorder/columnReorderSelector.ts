import { createSelector, createRootSelector } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridColumnReorderSelector = createRootSelector(
  (state: GridStatePro) => state.columnReorder,
);

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
