import { createSelector, createRootSelector } from '@mui/x-data-grid/internals';
import type { GridStatePro } from '../../../models/gridStatePro';

export const gridColumnReorderSelector = createRootSelector(
  (state: GridStatePro) => state.columnReorder,
);

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
