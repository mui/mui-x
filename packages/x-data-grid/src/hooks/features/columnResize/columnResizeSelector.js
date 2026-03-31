import { createRootSelector, createSelector } from '../../../utils/createSelector';
export const gridColumnResizeSelector = createRootSelector((state) => state.columnResize);
export const gridResizingColumnFieldSelector = createSelector(gridColumnResizeSelector, (columnResize) => columnResize.resizingColumnField);
