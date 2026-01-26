import type { GridRowId } from '../internal/rows/rowUtils';

// ================================
// Sort Model Types
// ================================

/**
 * The direction of the sort.
 * - 'asc': ascending order
 * - 'desc': descending order
 * - null: no sorting (unsorted)
 */
export type GridSortDirection = 'asc' | 'desc' | null;

/**
 * Represents a single sort item in the sort model.
 */
export interface GridSortItem {
  /** The column field identifier. */
  field: string;
  /** The direction of the sort. */
  sort: GridSortDirection;
}

/**
 * The model used for sorting the grid.
 * An array of sort items, where earlier items have higher priority.
 */
export type GridSortModel = readonly GridSortItem[];

// ================================
// Comparator Types
// ================================

/**
 * Parameters passed to sort comparators for each cell.
 */
export interface GridSortCellParams<V = any, R = any> {
  id: GridRowId;
  field: string;
  value: V;
  row: R;
}

// The type of the sort comparison function.
// Returns negative if v1 < v2, positive if v1 > v2, 0 if equal.
export type GridComparatorFn<V = any> = (
  v1: V,
  v2: V,
  cellParams1: GridSortCellParams<V>,
  cellParams2: GridSortCellParams<V>,
) => number;

// A factory function that returns a comparator based on the sort direction.
// Return undefined to skip sorting for that direction.
export type GridComparatorFnFactory<V = any> = (
  sortDirection: GridSortDirection,
) => GridComparatorFn<V> | undefined;

// ================================
// Column Metadata
// ================================

/**
 * Column metadata for sorting configuration.
 * This is merged into the column definition type.
 */
export interface SortingColumnMeta<V = any> {
  /** If `false`, the column is not sortable. Defaults to true. */
  sortable?: boolean;
  /**
   * A comparator function or factory for sorting column values.
   * Can be either:
   * - A direct comparator function: `(v1, v2, params1, params2) => number`
   * - A factory that returns a comparator based on direction: `(direction) => comparatorFn`
   */
  sortComparator?: GridComparatorFn<V> | GridComparatorFnFactory<V>;
  /** The order of the sorting sequence. Defaults to ['asc', 'desc', null]. */
  sortingOrder?: readonly GridSortDirection[];
  // A function to get the value to sort by from a row.
  sortValueGetter?: (row: any) => V;
}

// ================================
// Plugin State
// ================================

/**
 * The sorting plugin state.
 */
export interface SortingState {
  sorting: {
    /** The current sort model. */
    sortModel: GridSortModel;
    /** The sorted row IDs in order. */
    sortedRowIds: GridRowId[];
  };
}

// ================================
// Plugin Options
// ================================

/**
 * Options for the sorting plugin.
 */
export interface SortingOptions {
  /** Initial state for the sorting plugin. */
  initialState?: {
    sorting?: {
      sortModel?: GridSortModel;
    };
  };

  /** The sort model for controlled mode. */
  sortModel?: GridSortModel;

  // Callback fired when the sort model changes.
  onSortModelChange?: (model: GridSortModel) => void;

  /** The sorting mode: 'auto' (default) or 'manual'. */
  sortingMode?: 'auto' | 'manual';

  /** If true, multiple columns can be sorted at once. Defaults to true. */
  enableMultiSort?: boolean;

  /** If true, sorting builds on the current sorted order. Defaults to false. */
  stableSort?: boolean;

  /** The default sorting order cycle. Defaults to ['asc', 'desc', null]. */
  sortingOrder?: readonly GridSortDirection[];

  // Callback fired when sorted row IDs are recomputed.
  onSortedRowsSet?: (sortedRowIds: GridRowId[]) => void;
}

/**
 * Internal options for the sorting plugin.
 */
export interface SortingInternalOptions {
  /** If true, sorting is handled externally (e.g., server-side). */
  externalSorting?: boolean;
}

// ================================
// Plugin API
// ================================

/**
 * Lookup of column field to sort information.
 */
export interface SortColumnLookup {
  [field: string]: {
    sortDirection: GridSortDirection;
    sortIndex: number;
  };
}

/**
 * Selectors for the sorting plugin.
 */
export interface SortingSelectors {
  sortModel: (state: SortingState) => GridSortModel;
  sortedRowIds: (state: SortingState) => GridRowId[];
  sortColumnLookup: (state: SortingState) => SortColumnLookup;
  isSorted: (state: SortingState) => boolean;
}

/**
 * Options for computeSortedRowIds.
 */
export interface ComputeSortedRowIdsOptions {
  /** Use stable sort - build on current sorted order instead of starting fresh. */
  stableSort?: boolean;
  /** Current sorted row IDs to use as base for stable sort. Defaults to state. */
  currentSortedRowIds?: GridRowId[];
}

// The sorting plugin API.
export interface SortingApi {
  sorting: {
    // Get the current sort model.
    getSortModel: () => GridSortModel;

    // Set the sort model.
    setSortModel: (model: GridSortModel) => void;

    // Sort a column. Cycles through sortingOrder if direction is not provided.
    sortColumn: (field: string, direction?: GridSortDirection, multiSort?: boolean) => void;

    // Apply sorting using the current sort model. Uses computeSortedRowIds internally.
    applySorting: () => void;

    // Compute sorted row IDs without updating state.
    // Core sorting utility that can be used for external sorting workflows.
    computeSortedRowIds: (
      rowIds?: GridRowId[],
      sortModel?: GridSortModel,
      options?: ComputeSortedRowIdsOptions,
    ) => GridRowId[];

    // Selectors for accessing sorting state.
    selectors: SortingSelectors;
  };
}
