import { unstable_createSelector as createSelector } from '@mui/x-data-grid';
import { GridStatePro } from '../../../models/gridStatePro';

const gridDetailPanelSelector = (state: GridStatePro) => state.detailPanel;

export const gridDetailPanelExpandedRowIdsSelector = createSelector(
  gridDetailPanelSelector,
  (detailPanel) => detailPanel.expandedRowIds,
);

export const gridDetailPanelExpandedRowsContentCacheSelector = createSelector(
  gridDetailPanelSelector,
  (detailPanel) => detailPanel.contentCache,
);

export const gridDetailPanelExpandedRowsHeightCacheSelector = createSelector(
  gridDetailPanelSelector,
  (detailPanel) => detailPanel.heightCache,
);
