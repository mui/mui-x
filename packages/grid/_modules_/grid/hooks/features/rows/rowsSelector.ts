import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { InternalRowsState } from './rowsReducer';

export const rowsSelector = (state: GridState) => state.rows;
export const rowCountSelector = createSelector<GridState, InternalRowsState, number>(
  rowsSelector,
  (rows: InternalRowsState) => rows && rows.totalRowCount,
);
export const rowsLookupSelector = createSelector<GridState, InternalRowsState, Record<RowId, RowModel>>(
  rowsSelector,
  (rows: InternalRowsState) => rows && rows.idRowsLookup,
);

export const sortedRowsSelector = createSelector<GridState, InternalRowsState, RowModel[]>(
  rowsSelector,
  (rows: InternalRowsState) => {
    const sortedRows = rows.allRows.map((id) => rows.idRowsLookup[id]);
    return sortedRows;
  },
);
