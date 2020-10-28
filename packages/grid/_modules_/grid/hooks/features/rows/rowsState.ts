import { RowId, RowModel } from '../../../models/rows';

export interface InternalRowsState {
  idRowsLookup: Record<RowId, RowModel>;
  allRows: RowId[];
  totalRowCount: number;
}

export const getInitialRowState: () => InternalRowsState = () => ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0,
});
