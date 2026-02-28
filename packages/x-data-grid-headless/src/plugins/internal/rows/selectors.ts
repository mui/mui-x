import { createSelector } from '@base-ui/utils/store';
import type { GridRowId, RowsPluginState } from './types';

export const selectRowIdToModelLookup = createSelector(
  (state: RowsPluginState) => state.rows.dataRowIdToModelLookup,
);
export const selectTree = createSelector((state: RowsPluginState) => state.rows.tree);
export const selectTreeDepths = createSelector((state: RowsPluginState) => state.rows.treeDepths);
export const selectTotalRowCount = createSelector(
  (state: RowsPluginState) => state.rows.totalRowCount,
);
export const selectTotalTopLevelRowCount = createSelector(
  (state: RowsPluginState) => state.rows.totalTopLevelRowCount,
);
export const selectLoading = createSelector((state: RowsPluginState) => state.rows.loading);
export const selectGroupingName = createSelector(
  (state: RowsPluginState) => state.rows.groupingName,
);
export const selectRow = createSelector(
  selectRowIdToModelLookup,
  (lookup, id: GridRowId) => lookup[id] ?? null,
);
export const selectRowNode = createSelector(selectTree, (tree, id: GridRowId) => tree[id] ?? null);
export const selectProcessedRowIds = createSelector(
  (state: RowsPluginState) => state.rows.processedRowIds,
);

export const rowsSelectors = {
  rowIdToModelLookup: selectRowIdToModelLookup,
  tree: selectTree,
  treeDepths: selectTreeDepths,
  totalRowCount: selectTotalRowCount,
  totalTopLevelRowCount: selectTotalTopLevelRowCount,
  loading: selectLoading,
  groupingName: selectGroupingName,
  row: selectRow,
  rowNode: selectRowNode,
  processedRowIds: selectProcessedRowIds,
};
