import { createRootSelector, createSelector } from '@mui/x-data-grid-pro/internals';
export const gridSidebarStateSelector = createRootSelector((state) => state.sidebar);
export const gridSidebarOpenSelector = createSelector(gridSidebarStateSelector, (state) => state.open);
export const gridSidebarContentSelector = createSelector(gridSidebarStateSelector, ({ sidebarId, labelId, value }) => ({
    sidebarId,
    labelId,
    value,
}));
