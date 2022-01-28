import { unstable_createSelector as createSelector } from '@mui/x-data-grid';
import { GridStatePro } from '../../../models';

export const gridColumnResizeSelector = (state: GridStatePro) => state.columnResize;

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
