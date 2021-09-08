import { GridRowId, GridRowModel } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  totalRowCount: number;
}

export interface GridRowsInternalCache {
  state: GridRowsState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number | null;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  allRows: [],
  totalRowCount: 0,
});
