import { GridRowId } from '../../../models/gridRows';
import { GridSortModel } from '../../../models/gridSortModel';

export interface GridSortedRowTreeNode {
  id: GridRowId;
  children: GridSortedRowTreeNode[];
}

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortedRowTree: GridSortedRowTreeNode[];
  sortModel: GridSortModel;
}

export function getInitialGridSortingState(): GridSortingState {
  return { sortedRows: [], sortedRowTree: [], sortModel: [] };
}
