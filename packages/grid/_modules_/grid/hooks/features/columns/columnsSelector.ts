import { createSelector } from 'reselect';
import { Columns, ColumnsMeta, InternalColumns } from '../../../models/colDef/colDef';
import { GridState } from '../core/gridState';

export const columnsSelector = (state: GridState) => state.columns;
export const columnLookupSelector = (state: GridState) => state.columns.lookup;
export const allColumnsSelector = createSelector<GridState, InternalColumns, Columns>(
  columnsSelector,
  (columns: InternalColumns) => columns.all.map((field) => columns.lookup[field]),
);
export const visibleColumnsSelector = createSelector<GridState, Columns, Columns>(
  allColumnsSelector,
  (columns: Columns) => columns.filter((c) => c.field != null && !c.hide),
);

export const columnsMetaSelector = createSelector<GridState, Columns, ColumnsMeta>(
  visibleColumnsSelector,
  (visibleColumns) => {
    const positions: number[] = [];

    const totalWidth = visibleColumns.reduce((totalW, curCol) => {
      positions.push(totalW);
      return totalW + curCol.width!;
    }, 0);

    return { totalWidth, positions };
  },
);

export const filterableColumnsSelector = createSelector<GridState, Columns, Columns>(
  allColumnsSelector,
  (columns: Columns) => columns.filter((col) => col.filterable),
);
export const visibleColumnsLengthSelector = createSelector<GridState, Columns, number>(
  visibleColumnsSelector,
  (visibleColumns: Columns) => visibleColumns.length,
);
export const columnsTotalWidthSelector = createSelector<GridState, ColumnsMeta, number>(
  columnsMetaSelector,
  (meta: ColumnsMeta) => meta.totalWidth,
);
