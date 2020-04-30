export type SortDirection = 'asc' | 'desc' | null | undefined;

export type FieldComparatorList = { field: string; comparator: ComparatorFn }[];

export type ComparatorFn = (v1: any, v2: any) => number;

export interface SortItem {
  colId: string;
  sort: SortDirection;
}
export type SortModel = SortItem[];
