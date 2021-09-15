import { GridRowId, GridRowModel, GridRowIdTree } from '../../../models/gridRows';

export interface GridRowsState {
  idRowsLookup: Record<GridRowId, GridRowModel>;
  tree: GridRowIdTree;
  totalRowCount: number;
}

export const getInitialGridRowState: () => GridRowsState = () => ({
  idRowsLookup: {},
  tree: new Map(),
  totalRowCount: 0,
});
