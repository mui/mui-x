import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
import { GridStateColDef } from '../../../models';

export const gridColumnsSelector = (state: GridState) => state.columns;

// It includes even the hidden columns
export const allGridColumnsFieldsSelector = (state: GridState) => state.columns.all;

export const gridColumnLookupSelector = (state: GridState) => state.columns.lookup;

export const allGridColumnsSelector = createSelector(
  allGridColumnsFieldsSelector,
  gridColumnLookupSelector,
  (allFields, lookup) => allFields.map((field) => lookup[field]),
);

export const gridVisibleColumnsModelSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.visibleColumnsModel,
);

export const gridVisibleColumnsModelLookupSelector = createSelector(
  gridVisibleColumnsModelSelector,
  (visibleColumnsModel) => {
    const visibleColumnsLookup: Record<string, true> = {};

    visibleColumnsModel.forEach((field) => {
      visibleColumnsLookup[field] = true;
    });

    return visibleColumnsLookup;
  },
);

export const visibleGridColumnsSelector = createSelector(
  allGridColumnsSelector,
  gridVisibleColumnsModelLookupSelector,
  (allColumns, visibleColumnsModelLookup) =>
    allColumns.filter((column) => visibleColumnsModelLookup[column.field]),
);

export const gridVisibleColumnFieldsSelector = createSelector(
  visibleGridColumnsSelector,
  (visibleColumns) => visibleColumns.map((column) => column.field),
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
