import { createSelectorMemoized } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

const gridDetailPanelStateSelector = (state: GridStatePro) => state.detailPanel;

export const gridDetailPanelExpandedRowIdsSelector = (state: GridStatePro) =>
  state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (state: GridStatePro) =>
  state.detailPanel.contentCache;

export const gridDetailPanelRawHeightCacheSelector = createSelectorMemoized(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.heightCache,
);
