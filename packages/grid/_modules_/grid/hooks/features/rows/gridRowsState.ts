import { GridRowId, GridRowModel } from '../../../models/gridRows';

export interface InternalGridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  totalRowCount: number;
}

export const getInitialGridRowState: (rowCount?: number) => InternalGridRowsState = (rowCount) => ({
  idRowsLookup: {},
  allRows: rowCount !== undefined ? new Array(rowCount).fill(null) : [],
  totalRowCount: 0,
});
