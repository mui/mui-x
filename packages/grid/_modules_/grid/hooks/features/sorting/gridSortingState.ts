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

export interface GridSortingParams {
  sortRowList: GridSortingModelApplier | null;
}

export type GridSortingMethod = (params: GridSortingParams) => GridRowId[];

export type GridSortingMethodCollection = { [methodName: string]: GridSortingMethod };
