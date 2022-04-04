import { GridRowId, GridRowTreeNodeConfig } from '../../../models/gridRows';
import { GridSortModel } from '../../../models/gridSortModel';

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortModel: GridSortModel;
}

export interface GridSortingInitialState {
  sortModel?: GridSortModel;
}

export type GridSortingModelApplier = (rowList: GridRowTreeNodeConfig[]) => GridRowId[];

export interface GridSortingMethodParams {
  sortRowList: GridSortingModelApplier | null;
}

export type GridSortingMethodValue = GridRowId[];
