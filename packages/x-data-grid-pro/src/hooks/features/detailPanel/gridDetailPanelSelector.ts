import { RefObject } from '@mui/x-internals/types';
import { createSelectorMemoized } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { GridStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';

const gridDetailPanelStateSelector = (apiRef: RefObject<GridApiPro>) =>
  apiRef.current.state.detailPanel;

export const gridDetailPanelExpandedRowIdsSelector = (apiRef: RefObject<{ state: GridStatePro }>) =>
  apiRef.current.state.detailPanel.expandedRowIds;

export const gridDetailPanelExpandedRowsContentCacheSelector = (
  apiRef: RefObject<{ state: GridStatePro }>,
) => apiRef.current.state.detailPanel.contentCache;

export const gridDetailPanelRawHeightCacheSelector = createSelectorMemoized(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.heightCache,
);
