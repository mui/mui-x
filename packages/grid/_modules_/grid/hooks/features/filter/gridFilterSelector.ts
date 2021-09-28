import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { gridSortedRowsSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridSortedRowsTreeNode } from '../sorting';

export const gridFilterStateSelector = (state: GridState) => state.filter;

export const gridFilterModelSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filterModel,
);

export const gridVisibleRowsSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRows,
);

export const gridVisibleRowsLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRowsLookup,
);

export const gridVisibleRowCountSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRowCount,
);

export const gridVisibleTopLevelRowCountSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleTopLevelRowCount,
);

export const gridSortedVisibleRowsSelector = createSelector(
  gridVisibleRowsLookupSelector,
  gridSortedRowsSelector,
  (visibleRowsLookup, sortedRowsTree) => {
    const removeHiddenRows = (nodes: Map<GridRowId, GridSortedRowsTreeNode>) => {
      const filteredRows = new Map<GridRowId, GridSortedRowsTreeNode>();

      nodes.forEach((row, id) => {
        if (visibleRowsLookup[id] !== false) {
          filteredRows.set(id, {
            node: row.node,
            children: row.children ? removeHiddenRows(row.children) : undefined,
          });
        }
      });

      return filteredRows;
    };

    return removeHiddenRows(sortedRowsTree);
  },
);

export type VisibleRow = { id: GridRowId; node: GridRowModel; children?: VisibleRow[] };

export const gridSortedVisibleRowsAsArraySelector = createSelector(
  gridSortedVisibleRowsSelector,
  (rows) => {
    const flattenRowIds = (nodes: Map<GridRowId, GridSortedRowsTreeNode>): VisibleRow[] =>
      Array.from(nodes.entries()).map(([id, row]) => ({
        id,
        node: row.node,
        children: row.children ? flattenRowIds(row.children) : undefined,
      }));

    return flattenRowIds(rows);
  },
);

export const gridSortedVisibleRowsAsArrayFlatSelector = createSelector(
  gridSortedVisibleRowsSelector,
  (rows) => {
    const flattenRowIds = (
      nodes: Map<GridRowId, GridSortedRowsTreeNode>,
    ): { id: GridRowId; node: GridRowModel }[] =>
      Array.from(nodes.entries()).flatMap(([id, row]) => [
        { id, node: row.node },
        ...(row.children ? flattenRowIds(row.children) : []),
      ]);

    return flattenRowIds(rows);
  },
);

export const visibleSortedGridRowIdsSelector = createSelector(
  gridSortedVisibleRowsSelector,
  (visibleSortedRows) => [...visibleSortedRows.keys()],
);

export const activeGridFilterItemsSelector = createSelector(
  gridFilterModelSelector,
  gridColumnLookupSelector,
  (filterModel, columnLookup) =>
    filterModel.items?.filter((item) => {
      if (!item.columnField) {
        return false;
      }
      const column = columnLookup[item.columnField];
      if (!column?.filterOperators || column?.filterOperators?.length === 0) {
        return false;
      }
      const filterOperator = column.filterOperators.find(
        (operator) => operator.value === item.operatorValue,
      );
      if (!filterOperator) {
        return false;
      }
      return (
        !filterOperator.InputComponent || (item.value != null && item.value?.toString() !== '')
      );
    }),
);

export const filterGridItemsCounterSelector = createSelector(
  activeGridFilterItemsSelector,
  (activeFilters) => activeFilters.length,
);

export type FilterColumnLookup = Record<string, GridFilterItem[]>;
export const filterGridColumnLookupSelector = createSelector(
  activeGridFilterItemsSelector,
  (activeFilters) => {
    const result: FilterColumnLookup = activeFilters.reduce((res, filterItem) => {
      if (!res[filterItem.columnField!]) {
        res[filterItem.columnField!] = [filterItem];
      } else {
        res[filterItem.columnField!].push(filterItem);
      }
      return res;
    }, {} as FilterColumnLookup);

    return result;
  },
);
