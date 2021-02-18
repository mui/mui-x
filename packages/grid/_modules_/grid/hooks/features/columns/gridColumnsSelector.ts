import { createSelector } from 'reselect';
import { GridColumnLookup, GridColumns, GridColumnsMeta } from '../../../models/colDef/gridColDef';
import { GridState } from '../core/gridState';

export const gridColumnsSelector = (state: GridState) => state.columns;
export const allGridColumnsFieldsSelector = (state: GridState) => state.columns.all;
export const gridColumnLookupSelector = (state: GridState) => state.columns.lookup;
export const allGridColumnsSelector = createSelector<
  GridState,
  string[],
  GridColumnLookup,
  GridColumns
>(allGridColumnsFieldsSelector, gridColumnLookupSelector, (allFields, lookup) => {
  return allFields.map((field) => lookup[field]);
});
export const visibleGridColumnsSelector = createSelector<GridState, GridColumns, GridColumns>(
  allGridColumnsSelector,
  (columns: GridColumns) => columns.filter((c) => c.field != null && !c.hide),
);

export const gridColumnsMetaSelector = createSelector<GridState, GridColumns, GridColumnsMeta>(
  visibleGridColumnsSelector,
  (visibleColumns) => {
    const positions: number[] = [];

    const totalWidth = visibleColumns.reduce((totalW, curCol) => {
      positions.push(totalW);
      return totalW + curCol.width!;
    }, 0);

    return { totalWidth, positions };
  },
);

export const filterableGridColumnsSelector = createSelector<GridState, GridColumns, GridColumns>(
  allGridColumnsSelector,
  (columns: GridColumns) => columns.filter((col) => col.filterable),
);
export const filterableGridColumnsIdsSelector = createSelector<GridState, GridColumns, string[]>(
  filterableGridColumnsSelector,
  (columns: GridColumns) => {
    return columns.map((col) => col.field);
  },
);

export const visibleGridColumnsLengthSelector = createSelector<GridState, GridColumns, number>(
  visibleGridColumnsSelector,
  (visibleColumns: GridColumns) => visibleColumns.length,
);
export const gridColumnsTotalWidthSelector = createSelector<GridState, GridColumnsMeta, number>(
  gridColumnsMetaSelector,
  (meta: GridColumnsMeta) => meta.totalWidth,
);
