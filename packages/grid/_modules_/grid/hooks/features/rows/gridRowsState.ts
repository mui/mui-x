import { GridRowId, GridRowModel, GridRowConfigTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  paths: Record<GridRowId, string[]>;
  tree: GridRowConfigTree;
  totalRowCount: number;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  paths: {},
  tree: new Map(),
  totalRowCount: 0,
});
