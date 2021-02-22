import { GridCellValue } from './gridCell';
import { GridCellParams } from './params/gridCellParams';

export type GridSortDirection = 'asc' | 'desc' | null | undefined;

export type GridFieldComparatorList = { field: string; comparator: GridComparatorFn }[];

/**
 * The type of the sort comparison function.
 */
export type GridComparatorFn = (
  v1: GridCellValue,
  v2: GridCellValue,
  cellParams1: GridCellParams,
  cellParams2: GridCellParams,
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
