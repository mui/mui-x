import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { gridSortedRowsSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridSortedRowsTreeNode } from '../sorting';

export const gridVisibleRowStateSelector = (state: GridState) => state.visibleRows;

export const gridSortedVisibleRowsSelector = createSelector(
  gridVisibleRowStateSelector,
  gridSortedRowsSelector,
  (visibleRowsState, sortedRowsTree) => {
    const removeHiddenRows = (nodes: Map<GridRowId, GridSortedRowsTreeNode>) => {
      const filteredRows = new Map<GridRowId, GridSortedRowsTreeNode>();

      nodes.forEach((row, id) => {
        if (visibleRowsState.visibleRowsLookup[id] !== false) {
          filteredRows.set(id, {
            node: row.node,
            children: removeHiddenRows(row.children),
          });
        }
      });

      return filteredRows;
    };

    return removeHiddenRows(sortedRowsTree);
  },
);

export const visibleSortedGridRowsAsArraySelector = createSelector(
  gridSortedVisibleRowsSelector,
  (visibleSortedRows) => [...visibleSortedRows.entries()],
);

export const visibleSortedGridRowIdsSelector = createSelector(
  gridSortedVisibleRowsSelector,
  (visibleSortedRows) => [...visibleSortedRows.keys()],
);

export const gridVisibleRowCountSelector = createSelector(
  gridVisibleRowStateSelector,
  gridRowCountSelector,
  (visibleRowsState, totalRowsCount) => {
    if (visibleRowsState.visibleRows == null) {
      return totalRowsCount;
    }
    return visibleRowsState.visibleRows.length;
  },
);

export const filterGridStateSelector = (state: GridState) => state.filter;

export const activeGridFilterItemsSelector = createSelector(
  filterGridStateSelector,
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
