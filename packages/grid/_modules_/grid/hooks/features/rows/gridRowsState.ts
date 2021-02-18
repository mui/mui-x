import { GridRowId, GridRowModel } from '../../../models/gridRows';

export interface InternalGridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  totalRowCount: number;
}

export const getInitialGridRowState: () => InternalGridRowsState = () => ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0,
});
