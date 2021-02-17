import { createSelector } from 'reselect';
import { ColumnLookup, Columns, ColumnsMeta } from '../../../models/colDef/colDef';
import { GridState } from '../core/gridState';

export const gridColumnsSelector = (state: GridState) => state.columns;
export const allGridColumnsFieldsSelector = (state: GridState) => state.columns.all;
export const gridColumnLookupSelector = (state: GridState) => state.columns.lookup;
export const allGridColumnsSelector = createSelector<GridState, string[], ColumnLookup, Columns>(
  allGridColumnsFieldsSelector,
  gridColumnLookupSelector,
  (allFields, lookup) => {
    return allFields.map((field) => lookup[field]);
  },
);
export const visibleGridColumnsSelector = createSelector<GridState, Columns, Columns>(
  allGridColumnsSelector,
  (columns: Columns) => columns.filter((c) => c.field != null && !c.hide),
);

export const gridColumnsMetaSelector = createSelector<GridState, Columns, ColumnsMeta>(
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

export const filterableGridColumnsSelector = createSelector<GridState, Columns, Columns>(
  allGridColumnsSelector,
  (columns: Columns) => columns.filter((col) => col.filterable),
);
export const filterableGridColumnsIdsSelector = createSelector<GridState, Columns, string[]>(
  filterableGridColumnsSelector,
  (columns: Columns) => {
    return columns.map((col) => col.field);
  },
);

export const visibleGridColumnsLengthSelector = createSelector<GridState, Columns, number>(
  visibleGridColumnsSelector,
  (visibleColumns: Columns) => visibleColumns.length,
);
export const gridColumnsTotalWidthSelector = createSelector<GridState, ColumnsMeta, number>(
  gridColumnsMetaSelector,
  (meta: ColumnsMeta) => meta.totalWidth,
);
