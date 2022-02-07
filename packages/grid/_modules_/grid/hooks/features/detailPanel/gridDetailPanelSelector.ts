import { GridState } from '../../../models/gridState';

export const gridDetailPanelExpandedRowIdsSelector = (state: GridState) =>
  state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (state: GridState) =>
  state.detailPanel.contentCache;

export const gridDetailPanelExpandedRowsHeightCacheSelector = (state: GridState) =>
  state.detailPanel.heightCache;
