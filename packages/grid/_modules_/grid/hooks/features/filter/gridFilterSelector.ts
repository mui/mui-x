import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { gridSortedRowsSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridSortedRowsTree } from '../sorting';

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
    const removeHiddenRows = (tree: GridSortedRowsTree) => {
      const filteredRows: GridSortedRowsTree = new Map();

      tree.forEach((row, id) => {
        if (visibleRowsLookup[id] !== false) {
          filteredRows.set(id, {
            ...row,
            children: row.children ? removeHiddenRows(row.children) : undefined,
          });
        }
      });

      return filteredRows;
    };

    return removeHiddenRows(sortedRowsTree);
  },
);

export type TreeSortedVisibleRow = {
  id: GridRowId;
  model: GridRowModel;
  children?: TreeSortedVisibleRow[];
};

export const gridSortedVisibleRowsAsArraySelector = createSelector(
  gridSortedVisibleRowsSelector,
  (rows) => {
    const flattenRowIds = (tree: GridSortedRowsTree): TreeSortedVisibleRow[] =>
      Array.from(tree.entries()).map(([id, row]) => ({
        id,
        model: row.model,
        children: row.children ? flattenRowIds(row.children) : undefined,
      }));

    return flattenRowIds(rows);
  },
);

export type FlatSortedVisibleRow = { id: GridRowId; model: GridRowModel };

export const gridSortedVisibleRowsAsArrayFlatSelector = createSelector(
  gridSortedVisibleRowsSelector,
  (rows) => {
    const flattenRowIds = (tree: GridSortedRowsTree): FlatSortedVisibleRow[] =>
      Array.from(tree.entries()).flatMap(([id, row]) => [
        { id, model: row.model },
        ...(row.children ? flattenRowIds(row.children) : []),
      ]);

    return flattenRowIds(rows);
  },
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
