import { createSelector } from "@mui/x-data-grid/internals/utils/createSelector";
import { GridStatePro } from '../../../models/gridStatePro';

export const gridColumnReorderSelector = (state: GridStatePro) => state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
