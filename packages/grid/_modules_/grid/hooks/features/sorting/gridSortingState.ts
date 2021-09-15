import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSortModel } from '../../../models/gridSortModel';

export interface GridSortedRowsTreeNode {
  node: GridRowModel;
  children: Map<GridRowId, GridSortedRowsTreeNode>;
}

export interface GridSortedRowsIdTreeNode {
  id: GridRowId;
  children: GridSortedRowsIdTreeNode[];
}

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortedRowTree: GridSortedRowsIdTreeNode[];
  sortModel: GridSortModel;
}

export function getInitialGridSortingState(): GridSortingState {
  return { sortedRows: [], sortedRowTree: [], sortModel: [] };
}
