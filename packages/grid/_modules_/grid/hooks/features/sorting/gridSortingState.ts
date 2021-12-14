import { GridRowId, GridRowTreeNodeConfig } from '../../../models/gridRows';
import { GridComparatorFn, GridSortModel } from '../../../models/gridSortModel';

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortModel: GridSortModel;
}

export interface GridSortingInitialState {
  sortModel?: GridSortModel;
}

export interface GridSortingParams {
  comparatorList: GridSortingFieldComparator[];
  sortRowList: (rowList: GridRowTreeNodeConfig[]) => GridRowId[];
}

export type GridSortingFieldComparator = { field: string; comparator: GridComparatorFn };

export type GridSortingMethod = (params: GridSortingParams) => GridRowId[];

export type GridSortingMethodCollection = { [methodName: string]: GridSortingMethod };
