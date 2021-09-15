import { GridRowId, GridRowModel, GridRowIdTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  paths: Record<GridRowId, string[]>;
  tree: GridRowIdTree;
  totalRowCount: number;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  paths: {},
  tree: new Map(),
  totalRowCount: 0,
});
