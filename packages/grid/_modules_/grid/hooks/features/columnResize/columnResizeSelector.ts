import { createSelector } from '../../../utils/createSelector';
import { GridStatePro } from '../../../models/gridState';

export const gridColumnResizeSelector = (state: GridStatePro) => state.columnResize;

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
