import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createRootSelector, createSelector } from '../../../utils/createSelector';

export const gridColumnResizeSelector = createRootSelector(
  (state: GridStateCommunity) => state.columnResize,
);

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
