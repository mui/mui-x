import { createSelector } from '@mui/x-data-grid/internals/utils/createSelector';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridColumnResizeSelector = (state: GridStatePro) => state.columnResize;

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
