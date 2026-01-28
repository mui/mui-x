import type { GridRowId, GridTreeNode } from '../../../models/gridRows';
import type { GridSortModel } from '../../../models/gridSortModel';

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortModel: GridSortModel;
}

export interface GridSortingInitialState {
  sortModel?: GridSortModel;
}

export type GridSortingModelApplier = (rowList: GridTreeNode[]) => GridRowId[];

export interface GridSortingMethodParams {
  sortRowList: GridSortingModelApplier | null;
}

export type GridSortingMethodValue = GridRowId[];
