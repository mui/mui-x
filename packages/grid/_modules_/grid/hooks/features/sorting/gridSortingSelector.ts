import { createSelector } from 'reselect';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../core/gridState';
import {
  GridRowsLookup,
  gridRowsLookupSelector,
  unorderedGridRowIdsSelector,
} from '../rows/gridRowsSelector';
import {
  GridSortedRowsIdTreeNode,
  GridSortedRowsTreeNode,
  GridSortingState,
} from './gridSortingState';

const sortingGridStateSelector = (state: GridState) => state.sorting;

export const sortedGridRowIdsSelector = createSelector(
  sortingGridStateSelector,
  unorderedGridRowIdsSelector,
  (sortingState: GridSortingState, allRows: GridRowId[]) =>
    sortingState.sortedRows.length ? sortingState.sortedRows : allRows,
);

export const gridSortedRowsSelector = createSelector(
  sortedGridRowIdsSelector,
  gridRowsLookupSelector,
  (sortedIds: GridRowId[], idRowsLookup: GridRowsLookup) => {
    const map = new Map<GridRowId, GridRowModel>();
    sortedIds.forEach((id) => {
      map.set(id, idRowsLookup[id]);
    });
    return map;
  },
);

export const gridSortedRowIdsTreeSelector = createSelector(
  sortingGridStateSelector,
  (sortingState) => sortingState.sortedRowTree,
);

export const gridSortedRowsTreeSelector = createSelector(
  gridSortedRowIdsTreeSelector,
  gridRowsLookupSelector,
  (sortedTree, idRowsLookup) => {
    const buildMap = (nodes: GridSortedRowsIdTreeNode[]) => {
      const map = new Map<GridRowId, GridSortedRowsTreeNode>();

      nodes.forEach((node) => {
        map.set(node.id, { node: idRowsLookup[node.id], children: buildMap(node.children) });
      });

      return map;
    };

    return buildMap(sortedTree);
  },
);

export const gridSortModelSelector = createSelector(
  sortingGridStateSelector,
  (sorting) => sorting.sortModel,
);

export type GridSortColumnLookup = Record<
  string,
  { sortDirection: GridSortDirection; sortIndex?: number }
>;

export const gridSortColumnLookupSelector = createSelector(
  gridSortModelSelector,
  (sortModel: GridSortModel) => {
    const result: GridSortColumnLookup = sortModel.reduce((res, sortItem, index) => {
      res[sortItem.field] = {
        sortDirection: sortItem.sort,
        sortIndex: sortModel.length > 1 ? index + 1 : undefined,
      };
      return res;
    }, {});
    return result;
  },
);
