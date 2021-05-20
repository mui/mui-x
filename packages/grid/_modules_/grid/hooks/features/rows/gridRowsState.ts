import { GridRowId, GridRowModel } from '../../../models/gridRows';

export interface InternalGridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  totalRowCount: number;
}

export const getInitialGridRowState: (rowCount?: number) => InternalGridRowsState = (
  rowsCount = 0,
) => ({
  idRowsLookup: {},
  allRows: new Array(rowsCount).fill(null),
  totalRowCount: 0,
});
