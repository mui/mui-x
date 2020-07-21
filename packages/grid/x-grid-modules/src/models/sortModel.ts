import { CellValue, RowModel } from './rows';

export type SortDirection = 'asc' | 'desc' | null | undefined;

export type FieldComparatorList = { field: string; comparator: ComparatorFn }[];

/**
 * The type of the sort comparison function.
 */
export type ComparatorFn = (v1: CellValue, v2: CellValue, row1: RowModel, row2: RowModel) => number;

/**
 * Object that represents the column sorted data, part of the [[SortModel]].
 */
export interface SortItem {
  /**
   * The column field identifier
   */
  field: string;
  /**
   * The direction of the column that the grid should sort
   */
  sort: SortDirection;
}

/**
 * The model used for sorting the grid.
 */
export type SortModel = SortItem[];
