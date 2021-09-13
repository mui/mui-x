import { GridRowId, GridRowModel, GridRowTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  tree: GridRowTree;
  totalRowCount: number;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  tree: {},
  allRows: [],
  totalRowCount: 0,
});
