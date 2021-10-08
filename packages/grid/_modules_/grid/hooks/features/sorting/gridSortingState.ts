import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSortModel } from '../../../models/gridSortModel';

export type GridSortedRowsTree = Map<GridRowId, GridSortedRowsTreeNode>;

export interface GridSortedRowsTreeNode {
  model: GridRowModel;
  children?: GridSortedRowsTree;
}

export interface GridSortedRowsIdTreeNode {
  id: GridRowId;
  children?: GridSortedRowsIdTreeNode[];
}

export interface GridSortingState {
  sortedRows: GridSortedRowsIdTreeNode[];
  sortModel: GridSortModel;
}
