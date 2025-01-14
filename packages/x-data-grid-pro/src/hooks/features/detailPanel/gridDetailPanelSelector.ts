import { createSelectorMemoized } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';

const gridDetailPanelStateSelector = (apiRef: React.RefObject<GridApiPro>) =>
  apiRef.current.state.detailPanel;

export const gridDetailPanelExpandedRowIdsSelector = (apiRef: React.RefObject<GridApiPro>) =>
  apiRef.current.state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (
  apiRef: React.RefObject<GridApiPro>,
) => apiRef.current.state.detailPanel.contentCache;

export const gridDetailPanelRawHeightCacheSelector = createSelectorMemoized(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.heightCache,
);
