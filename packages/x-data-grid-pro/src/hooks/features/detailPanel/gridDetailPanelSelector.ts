import { GridRowId } from '@mui/x-data-grid';
import { createSelectorMemoized } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridDetailPanelExpandedRowIdsSelector = (state: GridStatePro) =>
  state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (state: GridStatePro) =>
  state.detailPanel.contentCache;

export const gridDetailPanelRawHeightCacheSelector = (state: GridStatePro) =>
  state.detailPanel.heightCache;

// TODO v6: Make this selector return the full object, including the autoHeight flag
export const gridDetailPanelExpandedRowsHeightCacheSelector = createSelectorMemoized(
  gridDetailPanelRawHeightCacheSelector,
  (heightCache) =>
    Object.entries(heightCache).reduce<Record<GridRowId, number>>((acc, [id, { height }]) => {
      acc[id] = height || 0;
      return acc;
    }, {}),
);
