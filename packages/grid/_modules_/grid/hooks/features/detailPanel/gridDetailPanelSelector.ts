import { GridState } from '../../../models/gridState';

export const gridExpandedRowIds = (state: GridState) => state.detailPanel.expandedRowIds;

export const gridExpandedRowsContentCache = (state: GridState) => state.detailPanel.contentCache;

export const gridExpandedRowsHeightCache = (state: GridState) => state.detailPanel.heightCache;
