import { GridRowId, GridRowTreeNodeConfig } from './gridRows';
import type { GridApiCommon } from './api';
import type { GridApiCommunity } from './api/gridApiCommunity';

export type GridSortDirection = 'asc' | 'desc' | null | undefined;

export interface GridSortCellParams<V = any, Api extends GridApiCommon = GridApiCommunity> {
  id: GridRowId;
  field: string;
  value: V;
  rowNode: GridRowTreeNodeConfig;
  api: Api;
}

/**
 * The type of the sort comparison function.
 */
export type GridComparatorFn<V = any, Api extends GridApiCommon = GridApiCommunity> = (
  v1: V,
  v2: V,
  cellParams1: GridSortCellParams<V, Api>,
  cellParams2: GridSortCellParams<V, Api>,
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
