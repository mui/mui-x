import { GridRowId, GridRowModel } from '../../../models/gridRows';
import {
  createRootSelector,
  createSelector,
  createSelectorMemoized,
} from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsStateSelector = createRootSelector((state: GridStateCommunity) => state.rows);

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalRowCount,
);

export const gridRowsLoadingSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.loading,
);

export const gridTopLevelRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalTopLevelRowCount,
);

// TODO rows v6: Rename
export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.dataRowIdToModelLookup,
);

export const gridRowSelector = createSelector(
  gridRowsLookupSelector,
  (rows, id: GridRowId) => rows[id],
);

export const gridRowTreeSelector = createSelector(gridRowsStateSelector, (rows) => rows.tree);

export const gridRowNodeSelector = createSelector(
  gridRowTreeSelector,
  (rowTree, rowId: GridRowId) => rowTree[rowId],
);

export const gridRowGroupsToFetchSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.groupsToFetch,
);

export const gridRowGroupingNameSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.groupingName,
);

export const gridRowTreeDepthsSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.treeDepths,
);

export const gridRowMaximumTreeDepthSelector = createSelectorMemoized(
  gridRowsStateSelector,
  (rows) => {
    const entries = Object.entries(rows.treeDepths);

    if (entries.length === 0) {
      return 1;
    }

    return (
      (entries
        .filter(([, nodeCount]) => nodeCount > 0)
        .map(([depth]) => Number(depth))
        .sort((a, b) => b - a)[0] ?? 0) + 1
    );
  },
);

export const gridDataRowIdsSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.dataRowIds,
);

export const gridDataRowsSelector = createSelectorMemoized(
  gridDataRowIdsSelector,
  gridRowsLookupSelector,
  (dataRowIds, rowsLookup) =>
    dataRowIds.reduce((acc, id) => {
      if (!rowsLookup[id]) {
        return acc;
      }
      acc.push(rowsLookup[id]);
      return acc;
    }, [] as GridRowModel[]),
);

/**
 * @ignore - do not document.
 */
export const gridAdditionalRowGroupsSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows?.additionalRowGroups,
);

/**
 * @ignore - do not document.
 */
export const gridPinnedRowsSelector = createSelectorMemoized(
  gridAdditionalRowGroupsSelector,
  (additionalRowGroups) => {
    const rawPinnedRows = additionalRowGroups?.pinnedRows;

    return {
      bottom:
        rawPinnedRows?.bottom?.map((rowEntry) => ({
          id: rowEntry.id,
          model: rowEntry.model ?? {},
        })) ?? [],
      top:
        rawPinnedRows?.top?.map((rowEntry) => ({
          id: rowEntry.id,
          model: rowEntry.model ?? {},
        })) ?? [],
    };
  },
);

/**
 * @ignore - do not document.
 */
export const gridPinnedRowsCountSelector = createSelector(gridPinnedRowsSelector, (pinnedRows) => {
  return (pinnedRows?.top?.length || 0) + (pinnedRows?.bottom?.length || 0);
});
