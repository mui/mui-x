import { createSelector } from 'reselect';
import { GridRowId } from '../../../models/gridRows';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../core/gridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridSortedRowsIdTreeNode, GridSortedRowsTree } from './gridSortingState';

const gridSortingStateSelector = (state: GridState) => state.sorting;

export const gridSortedRowIdsSelector = createSelector(
  gridSortingStateSelector,
  (sortingState) => sortingState.sortedRows,
);

export const gridSortedRowIdsFlatSelector = createSelector(
  gridSortedRowIdsSelector,
  (sortedRowIds) => {
    const flattenRowIds = (nodes: GridSortedRowsIdTreeNode[]): GridRowId[] =>
      nodes.flatMap((node) => [node.id, ...(node.children ? flattenRowIds(node.children) : [])]);

    return flattenRowIds(sortedRowIds);
  },
);

export const gridSortedRowsSelector = createSelector(
  gridSortedRowIdsSelector,
  gridRowsLookupSelector,
  (sortedTree, idRowsLookup) => {
    const buildMap = (nodes: GridSortedRowsIdTreeNode[]) => {
      const map: GridSortedRowsTree = new Map();

      nodes.forEach((node) => {
        map.set(node.id, {
          model: idRowsLookup[node.id],
          children: node.children ? buildMap(node.children) : undefined,
        });
      });

      return map;
    };

    return buildMap(sortedTree);
  },
);

export const gridSortModelSelector = createSelector(
  gridSortingStateSelector,
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
