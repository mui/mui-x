import { createSelector, createRootSelector } from '@mui/x-data-grid/internals';
export const gridColumnReorderSelector = createRootSelector((state) => state.columnReorder);
export const gridColumnReorderDragColSelector = createSelector(gridColumnReorderSelector, (columnReorder) => columnReorder.dragCol);
