import { SortDirection, ComparatorFn } from '../models/sortModel';
import { CellValue } from '../models/rows';

export const nextSortDirection = (sortingOrder: SortDirection[], current?: SortDirection) => {
  const currentIdx = sortingOrder.indexOf(current);
  if (!current || currentIdx === -1 || currentIdx + 1 === sortingOrder.length) {
    return sortingOrder[0];
  }

  return sortingOrder[currentIdx + 1];
};

export const isDesc = (direction: SortDirection) => direction === 'desc';

export const nillComparer = (v1: CellValue, v2: CellValue): number | null => {
  if (v1 == null && v2 != null) return -1;
  if (v2 == null && v1 != null) return 1;
  if (v1 == null && v2 == null) return 0;

  return null;
};

export const stringNumberComparer: ComparatorFn = (v1: CellValue, v2: CellValue) => {
  const nillResult = nillComparer(v1, v2);
  if (nillResult != null) {
    return nillResult;
  }

  if (typeof v1 === 'string') {
    return v1.localeCompare(v2!.toString());
  }
  return (v1 as any) - (v2 as any);
};

export const numberComparer: ComparatorFn = (v1: CellValue, v2: CellValue) => {
  const nillResult = nillComparer(v1, v2);
  if (nillResult != null) {
    return nillResult;
  }
  return Number(v1) - Number(v2);
};

export const dateComparer = (v1: CellValue, v2: CellValue): number => {
  const nillResult = nillComparer(v1, v2);
  if (nillResult != null) {
    return nillResult;
  }

  if (v1! > v2!) return 1;
  if (v1! < v2!) return -1;
  return 0;
};
