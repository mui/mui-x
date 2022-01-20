import { GridCellValue } from '../models/gridCell';
import { GridSortDirection, GridComparatorFn } from '../models/gridSortModel';

export const nextGridSortDirection = (
  sortingOrder: GridSortDirection[],
  current?: GridSortDirection,
) => {
  const currentIdx = sortingOrder.indexOf(current);
  if (!current || currentIdx === -1 || currentIdx + 1 === sortingOrder.length) {
    return sortingOrder[0];
  }

  return sortingOrder[currentIdx + 1];
};

export const isDesc = (direction: GridSortDirection) => direction === 'desc';

export const gridNillComparer = (v1: GridCellValue, v2: GridCellValue): number | null => {
  if (v1 == null && v2 != null) {
    return -1;
  }
  if (v2 == null && v1 != null) {
    return 1;
  }
  if (v1 == null && v2 == null) {
    return 0;
  }

  return null;
};

const collator = new Intl.Collator();

export const gridStringNumberComparer: GridComparatorFn = (
  value1: GridCellValue,
  value2: GridCellValue,
) => {
  const nillResult = gridNillComparer(value1, value2);
  if (nillResult !== null) {
    return nillResult;
  }

  if (typeof value1 === 'string') {
    return collator.compare(value1!.toString(), value2!.toString());
  }
  return (value1 as any) - (value2 as any);
};

export const gridNumberComparer: GridComparatorFn = (
  value1: GridCellValue,
  value2: GridCellValue,
) => {
  const nillResult = gridNillComparer(value1, value2);
  if (nillResult !== null) {
    return nillResult;
  }

  return Number(value1) - Number(value2);
};

export const gridDateComparer = (value1: GridCellValue, value2: GridCellValue): number => {
  const nillResult = gridNillComparer(value1, value2);
  if (nillResult !== null) {
    return nillResult;
  }

  if (value1! > value2!) {
    return 1;
  }
  if (value1! < value2!) {
    return -1;
  }
  return 0;
};
