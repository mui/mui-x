import type { GridRowId } from '../internal/rows/rowUtils';
import type {
  GridSortDirection,
  GridSortModel,
  GridSortItem,
  GridComparatorFn,
  GridSortCellParams,
  SortingColumnMeta,
} from './types';

/**
 * Comparator for null/undefined values.
 * Returns a number if one or both values are null, or null if both are non-null.
 * Nulls are sorted first (before non-null values).
 */
const gridNullComparator = (value1: any, value2: any): number | null => {
  if (value1 == null && value2 != null) {
    return -1;
  }
  if (value2 == null && value1 != null) {
    return 1;
  }
  if (value1 == null && value2 == null) {
    return 0;
  }
  return null;
};

/**
 * Create a string/number comparator with the given locale(s).
 */
export const createStringOrNumberComparator = (locale?: string | string[]): GridComparatorFn => {
  const collator = new Intl.Collator(locale);
  return (value1, value2) => {
    const nullResult = gridNullComparator(value1, value2);
    if (nullResult !== null) {
      return nullResult;
    }

    if (typeof value1 === 'string') {
      return collator.compare(value1!.toString(), value2!.toString());
    }
    return (value1 as number) - (value2 as number);
  };
};

/**
 * Comparator for number values.
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

/**
 * Get the next sort direction in the cycle.
 * @param {readonly GridSortDirection[]} sortingOrder The order of sort directions to cycle through.
 * @param {GridSortDirection} current The current sort direction.
 * @returns {GridSortDirection} The next sort direction in the cycle.
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
 * @param {GridSortModel} sortModel The current sort model.
 * @param {string} field The field to upsert.
 * @param {GridSortItem | undefined} sortItem The new sort item (or undefined to remove).
 * @returns {GridSortModel} The updated sort model.
 */
export const upsertSortModel = (
  sortModel: GridSortModel,
  field: string,
  sortItem: GridSortItem | undefined,
): GridSortModel => {
  const fieldIndex = sortModel.findIndex((item) => item.field === field);
  const newSortModel = [...sortModel];

  if (fieldIndex > -1) {
    if (sortItem == null || sortItem.sort == null) {
      // Remove the item
      newSortModel.splice(fieldIndex, 1);
    } else {
      // Update the item
      newSortModel.splice(fieldIndex, 1, sortItem);
    }
  } else if (sortItem != null && sortItem.sort != null) {
    // Add new item
    newSortModel.push(sortItem);
  }

  return newSortModel;
};

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

/**
 * Check if a sortComparator is a factory function (returns comparator based on direction)
 * vs a direct comparator function.
 * Factory functions have 1 parameter (direction), direct comparators have 4 (v1, v2, params1, params2).
 * @param {GridComparatorFn | ((direction: GridSortDirection) => GridComparatorFn | undefined)} fn The comparator function to check.
 * @returns {boolean} True if the comparator is a factory function, false if it is a direct comparator function.
 */
const isComparatorFactory = (
  fn: GridComparatorFn | ((direction: GridSortDirection) => GridComparatorFn | undefined),
): fn is (direction: GridSortDirection) => GridComparatorFn | undefined => {
  return fn.length <= 1;
};

/**
 * Normalize sortComparator to always be a factory function internally.
 * If it's a direct comparator, wrap it to apply direction modifier.
 * @param {GridComparatorFn | ((direction: GridSortDirection) => GridComparatorFn | undefined)} sortComparator The sort comparator to normalize.
 * @returns {((direction: GridSortDirection) => GridComparatorFn | undefined)} The normalized sort comparator.
 */
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

/**
 * Parse a sort item into a comparator function.
 * @param {GridSortItem} sortItem The sort item to parse.
 * @param {(field) => (ColumnInfo & SortingColumnMeta) | undefined} getColumn The function to get the column.
 * @param {string} field The field to get the column for.
 * @returns {ParsedSortItem | null} The parsed sort item. Returns null if the sort item is not valid.
 */
const parseSortItem = (
  sortItem: GridSortItem,
  getColumn: (field: string) => (ColumnInfo & SortingColumnMeta) | undefined,
  defaultComparator: GridComparatorFn,
): ParsedSortItem | null => {
  const column = getColumn(sortItem.field);
  if (!column || sortItem.sort === null || column.sortable === false) {
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
    comparator = isDesc ? (...args) => -1 * defaultComparator(...args) : defaultComparator;
  }

  if (!comparator) {
    return null;
  }

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
  locale?: string | string[];
}

/**
 * Build a function that sorts row IDs according to the sort model.
 * @returns A function that takes row IDs and returns sorted row IDs, or null if no sorting.
 */
export const buildSortingApplier = ({
  sortModel,
  getColumn,
  getRow,
  locale,
}: SortingApplierParams): ((rowIds: GridRowId[]) => GridRowId[]) | null => {
  const parsedSortItems = sortModel
    .map((item) => parseSortItem(item, getColumn, createStringOrNumberComparator(locale)))
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
