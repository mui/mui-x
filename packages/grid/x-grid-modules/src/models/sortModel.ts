import { CellValue, RowModel } from './rows';

export type SortDirection = 'asc' | 'desc' | null | undefined;

export type FieldComparatorList = { field: string; comparator: ComparatorFn }[];

export type ComparatorFn = (v1: CellValue, v2: CellValue, row1: RowModel, row2: RowModel) => number;

export interface SortItem {
  colId: string;
  sort: SortDirection;
}
export type SortModel = SortItem[];
