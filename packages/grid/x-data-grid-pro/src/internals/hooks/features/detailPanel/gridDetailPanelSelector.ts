import { GridStatePro } from '../../../models/gridStatePro';

export const gridDetailPanelExpandedRowIdsSelector = (state: GridStatePro) =>
  state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (state: GridStatePro) =>
  state.detailPanel.contentCache;

export const gridDetailPanelExpandedRowsHeightCacheSelector = (state: GridStatePro) =>
  state.detailPanel.heightCache;
