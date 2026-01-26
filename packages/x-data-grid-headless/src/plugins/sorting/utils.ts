import type { GridRowId } from '../internal/rows/rowUtils';
import type {
  GridSortDirection,
  GridSortModel,
  GridSortItem,
  GridComparatorFn,
  GridSortCellParams,
  SortingColumnMeta,
} from './types';

// ================================
// Default Comparators
// ================================

/**
 * Comparator for null/undefined values.
 * Returns a number if one or both values are null, or null if both are non-null.
 * Nulls are sorted first (before non-null values).
 */
const gridNullComparator = (v1: any, v2: any): number | null => {
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

/**
 * Comparator for string or number values.
 * Strings are compared using locale-aware collation.
 * Numbers are compared numerically.
 * Null values are sorted first.
 */
export const gridStringOrNumberComparator: GridComparatorFn = (value1, value2) => {
  const nullResult = gridNullComparator(value1, value2);
  if (nullResult !== null) {
    return nullResult;
  }

  if (typeof value1 === 'string') {
    return collator.compare(value1!.toString(), value2!.toString());
  }
  return (value1 as number) - (value2 as number);
};

/**
 * Comparator for number values.
 * Null values are sorted first.
 */
export const gridNumberComparator: GridComparatorFn = (value1, value2) => {
  const nullResult = gridNullComparator(value1, value2);
  if (nullResult !== null) {
    return nullResult;
  }

  return Number(value1) - Number(value2);
};

/**
 * Comparator for date values.
 * Null values are sorted first.
 */
export const gridDateComparator: GridComparatorFn = (value1, value2) => {
  const nullResult = gridNullComparator(value1, value2);
  if (nullResult !== null) {
    return nullResult;
  }

  if (value1! > value2!) {
    return 1;
  }
  if (value1! < value2!) {
    return -1;
  }
  return 0;
};

// ================================
// Sort Model Utilities
// ================================

/**
 * Get the next sort direction in the cycle.
 * @param sortingOrder The order of sort directions to cycle through.
 * @param current The current sort direction.
 * @returns The next sort direction in the cycle.
 */
export const getNextGridSortDirection = (
  sortingOrder: readonly GridSortDirection[],
  current?: GridSortDirection,
): GridSortDirection => {
  const currentIdx = current != null ? sortingOrder.indexOf(current) : -1;
  if (current == null || currentIdx === -1 || currentIdx + 1 === sortingOrder.length) {
    return sortingOrder[0];
  }
  return sortingOrder[currentIdx + 1];
};

/**
 * Upsert a sort item into the sort model.
 * If the item has sort: null, it is removed from the model.
 * @param sortModel The current sort model.
 * @param field The field to upsert.
 * @param sortItem The new sort item (or undefined to remove).
 * @returns The updated sort model.
 */
export const upsertSortModel = (
  sortModel: GridSortModel,
  field: string,
  sortItem: GridSortItem | undefined,
): GridSortModel => {
  const existingIdx = sortModel.findIndex((item) => item.field === field);
  const newSortModel = [...sortModel];

  if (existingIdx > -1) {
    if (sortItem == null || sortItem.sort == null) {
      // Remove the item
      newSortModel.splice(existingIdx, 1);
    } else {
      // Update the item
      newSortModel.splice(existingIdx, 1, sortItem);
    }
  } else if (sortItem != null && sortItem.sort != null) {
    // Add new item
    newSortModel.push(sortItem);
  }

  return newSortModel;
};

// ================================
// Sorting Applier
// ================================

interface ColumnInfo {
  field?: string | number | symbol;
  id?: string;
  sortComparator?:
    | GridComparatorFn
    | ((direction: GridSortDirection) => GridComparatorFn | undefined);
  sortValueGetter?: (row: any) => any;
}

interface ParsedSortItem {
  comparator: GridComparatorFn;
  field: string;
  getValue: (row: any, id: GridRowId) => any;
}

// Check if a sortComparator is a factory function (returns comparator based on direction)
// vs a direct comparator function.
// Factory functions have 1 parameter (direction), direct comparators have 4 (v1, v2, params1, params2).
const isComparatorFactory = (
  fn: GridComparatorFn | ((direction: GridSortDirection) => GridComparatorFn | undefined),
): fn is (direction: GridSortDirection) => GridComparatorFn | undefined => {
  return fn.length <= 1;
};

// Normalize sortComparator to always be a factory function internally.
// If it's a direct comparator, wrap it to apply direction modifier.
const normalizeToComparatorFactory = (
  sortComparator:
    | GridComparatorFn
    | ((direction: GridSortDirection) => GridComparatorFn | undefined),
): ((direction: GridSortDirection) => GridComparatorFn | undefined) => {
  if (isComparatorFactory(sortComparator)) {
    return sortComparator;
  }
  // It's a direct comparator - wrap it to apply direction modifier
  const directComparator = sortComparator as GridComparatorFn;
  return (direction: GridSortDirection) => {
    if (direction === null) {
      return undefined;
    }
    const isDesc = direction === 'desc';
    return isDesc ? (...args) => -1 * directComparator(...args) : directComparator;
  };
};

// Parse a sort item into a comparator function.
const parseSortItem = (
  sortItem: GridSortItem,
  getColumn: (field: string) => (ColumnInfo & SortingColumnMeta) | undefined,
): ParsedSortItem | null => {
  const column = getColumn(sortItem.field);
  if (!column || sortItem.sort === null) {
    return null;
  }

  let comparator: GridComparatorFn | undefined;

  if (column.sortComparator) {
    // Normalize to factory and get comparator for this direction
    const factory = normalizeToComparatorFactory(column.sortComparator);
    comparator = factory(sortItem.sort);
  } else {
    // Use default comparator with direction modifier
    const isDesc = sortItem.sort === 'desc';
    comparator = isDesc
      ? (...args) => -1 * gridStringOrNumberComparator(...args)
      : gridStringOrNumberComparator;
  }

  if (!comparator) {
    return null;
  }

  // Create value getter
  const fieldKey = column.field ?? column.id;
  const getValue = column.sortValueGetter
    ? (row: any, _id: GridRowId) => column.sortValueGetter!(row)
    : (row: any, _id: GridRowId) => (fieldKey ? row[fieldKey as string] : undefined);

  return {
    comparator,
    field: sortItem.field,
    getValue,
  };
};

interface SortingApplierParams {
  sortModel: GridSortModel;
  getColumn: (field: string) => (ColumnInfo & SortingColumnMeta) | undefined;
  getRow: (id: GridRowId) => any;
}

/**
 * Build a function that sorts row IDs according to the sort model.
 * @returns A function that takes row IDs and returns sorted row IDs, or null if no sorting.
 */
export const buildSortingApplier = ({
  sortModel,
  getColumn,
  getRow,
}: SortingApplierParams): ((rowIds: GridRowId[]) => GridRowId[]) | null => {
  const parsedSortItems = sortModel
    .map((item) => parseSortItem(item, getColumn))
    .filter((item): item is ParsedSortItem => item !== null);

  if (parsedSortItems.length === 0) {
    return null;
  }

  return (rowIds: GridRowId[]): GridRowId[] => {
    // Build row data with pre-computed cell params for each sort item
    const rowsWithParams = rowIds.map((id) => {
      const row = getRow(id);
      const params: GridSortCellParams[] = parsedSortItems.map((item) => ({
        id,
        field: item.field,
        value: item.getValue(row, id),
        row,
      }));
      return { id, params };
    });

    // Sort using the comparators
    rowsWithParams.sort((a, b) => {
      for (let i = 0; i < parsedSortItems.length; i += 1) {
        const { comparator } = parsedSortItems[i];
        const paramsA = a.params[i];
        const paramsB = b.params[i];
        const result = comparator(paramsA.value, paramsB.value, paramsA, paramsB);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });

    return rowsWithParams.map((row) => row.id);
  };
};

/**
 * Apply sorting to row IDs.
 * If stableSort is true, uses the current order as the base.
 * Otherwise, uses the original row IDs order.
 */
export const applySortingToRowIds = (
  rowIds: GridRowId[],
  sortingApplier: ((rowIds: GridRowId[]) => GridRowId[]) | null,
  stableSort: boolean = false,
  currentSortedRowIds?: GridRowId[],
): GridRowId[] => {
  if (!sortingApplier) {
    // No sorting, return original order
    return rowIds;
  }

  // Determine the input order for sorting
  const inputIds = stableSort && currentSortedRowIds ? currentSortedRowIds : rowIds;

  // Filter to only include IDs that exist in rowIds (in case of row changes)
  const rowIdSet = new Set(rowIds);
  const idsToSort = inputIds.filter((id) => rowIdSet.has(id));

  // Add any new IDs that aren't in currentSortedRowIds (for stableSort)
  if (stableSort && currentSortedRowIds) {
    const currentIdSet = new Set(currentSortedRowIds);
    rowIds.forEach((id) => {
      if (!currentIdSet.has(id)) {
        idsToSort.push(id);
      }
    });
  }

  return sortingApplier(idsToSort);
};
