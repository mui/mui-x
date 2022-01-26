import { GridCellValue } from './gridCell';
import { GridRowId, GridRowTreeNodeConfig } from './gridRows';
import type { GridApiCommunity, GridApiCommon } from './api';

export type GridSortDirection = 'asc' | 'desc' | null | undefined;

export interface GridSortCellParams<GridApi extends GridApiCommon = GridApiCommunity> {
  id: GridRowId;
  field: string;
  value: GridCellValue;
  rowNode: GridRowTreeNodeConfig;
  api: GridApi;
}

/**
 * The type of the sort comparison function.
 */
export type GridComparatorFn<GridApi extends GridApiCommon = GridApiCommunity> = (
  v1: GridCellValue,
  v2: GridCellValue,
  cellParams1: GridSortCellParams<GridApi>,
  cellParams2: GridSortCellParams<GridApi>,
) => number;

/**
 * Object that represents the column sorted data, part of the [[GridSortModel]].
 */
export interface GridSortItem {
  /**
   * The column field identifier.
   */
  field: string;
  /**
   * The direction of the column that the grid should sort.
   */
  sort: GridSortDirection;
}

/**
 * The model used for sorting the grid.
 */
export type GridSortModel = GridSortItem[];
