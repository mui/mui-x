import { RowId, RowModel } from '../../../models/rows';

export interface InternalGridRowsState {
  idRowsLookup: Record<RowId, RowModel>;
  allRows: RowId[];
  totalRowCount: number;
}

export const getInitialGridRowState: () => InternalGridRowsState = () => ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0,
});
