import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';

export const gridColumnsSelector = (state: GridState) => state.columns;

export const allGridColumnsFieldsSelector = (state: GridState) => state.columns.all;

export const gridColumnLookupSelector = (state: GridState) => state.columns.lookup;

export const allGridColumnsSelector = createSelector(
  allGridColumnsFieldsSelector,
  gridColumnLookupSelector,
  (allFields, lookup) => allFields.map((field) => lookup[field]),
);
export const visibleGridColumnsSelector = createSelector(allGridColumnsSelector, (columns) =>
  columns.filter((c) => c.field != null && !c.hide),
);

export const gridColumnsMetaSelector = createSelector(
  visibleGridColumnsSelector,
  (visibleColumns) => {
    const positions: number[] = [];

    const totalWidth = visibleColumns.reduce((acc, curCol) => {
      positions.push(acc);
      return acc + curCol.computedWidth;
    }, 0);

    return { totalWidth, positions };
  },
);

export const filterableGridColumnsSelector = createSelector(allGridColumnsSelector, (columns) =>
  columns.filter((col) => col.filterable),
);

export const filterableGridColumnsIdsSelector = createSelector(
  filterableGridColumnsSelector,
  (columns) => columns.map((col) => col.field),
);

export const visibleGridColumnsLengthSelector = createSelector(
  visibleGridColumnsSelector,
  (visibleColumns) => visibleColumns.length,
);

export const gridColumnsTotalWidthSelector = createSelector(
  gridColumnsMetaSelector,
  (meta) => meta.totalWidth,
);
