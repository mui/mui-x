import { GridRowId, GridRowModel, GridRowIdTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  allRows: GridRowId[];
  tree: GridRowIdTree;
  totalRowCount: number;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  tree: {},
  allRows: [],
  totalRowCount: 0,
});
