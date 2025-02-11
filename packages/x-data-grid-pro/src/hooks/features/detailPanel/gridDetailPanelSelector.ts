import {
  createSelector,
  createRootSelector,
  createSelectorMemoized,
} from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridDetailPanelStateSelector = createRootSelector(
  (state: GridStatePro) => state.detailPanel,
);

export const gridDetailPanelExpandedRowIdsSelector = createSelector(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.expandedRowIds,
);

export const gridDetailPanelExpandedRowsContentCacheSelector = createSelector(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.contentCache,
);

export const gridDetailPanelRawHeightCacheSelector = createSelectorMemoized(
  gridDetailPanelStateSelector,
  (detailPanelState) => detailPanelState.heightCache,
);
