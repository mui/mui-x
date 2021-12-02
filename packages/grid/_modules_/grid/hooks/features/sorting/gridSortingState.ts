import { GridRowId, GridRowTreeNodeConfig } from '../../../models/gridRows';
import { GridFieldComparatorList, GridSortModel } from '../../../models/gridSortModel';

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortModel: GridSortModel;
}

export interface GridSortingInitialState {
  sortModel?: GridSortModel;
}

export interface GridSortingParams {
  comparatorList: GridFieldComparatorList;
  sortRowList: (rowList: GridRowTreeNodeConfig[]) => GridRowId[];
}

export type GridSortingMethod = (params: GridSortingParams) => GridRowId[];

export type GridSortingMethodCollection = { [methodName: string]: GridSortingMethod };
