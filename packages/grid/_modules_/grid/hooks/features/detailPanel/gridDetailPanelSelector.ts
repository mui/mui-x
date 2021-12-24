import { GridState } from '../../../models/gridState';

export const gridExpandedRowIdsSelector = (state: GridState) => state.detailPanel.expandedRowIds;

export const gridExpandedRowsContentCacheSelector = (state: GridState) =>
  state.detailPanel.contentCache;

export const gridExpandedRowsHeightCacheSelector = (state: GridState) =>
  state.detailPanel.heightCache;
