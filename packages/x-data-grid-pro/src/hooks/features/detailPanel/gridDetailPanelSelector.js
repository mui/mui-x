import { createSelector, createRootSelector, createSelectorMemoized, } from '@mui/x-data-grid/internals';
export const gridDetailPanelStateSelector = createRootSelector((state) => state.detailPanel);
export const gridDetailPanelExpandedRowIdsSelector = createSelector(gridDetailPanelStateSelector, (detailPanelState) => detailPanelState.expandedRowIds);
export const gridDetailPanelExpandedRowsContentCacheSelector = createSelector(gridDetailPanelStateSelector, (detailPanelState) => detailPanelState.contentCache);
export const gridDetailPanelRawHeightCacheSelector = createSelectorMemoized(gridDetailPanelStateSelector, (detailPanelState) => detailPanelState.heightCache);
