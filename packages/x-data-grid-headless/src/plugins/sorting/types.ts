import type { GridRowId } from '../internal/rows/types';

export type GridSortDirection = 'asc' | 'desc' | null;

export interface GridSortItem {
  field: string;
  direction: GridSortDirection;
}

export type GridSortModel = readonly GridSortItem[];

/**
 * Parameters passed to sort comparators for each cell.
 */
export interface GridSortCellParams<V = any, R = any> {
  id: GridRowId;
  field: string;
  value: V;
  row: R;
}

/**
 * The sort comparator function.
 * @param {V} v1 The first value to compare.
 * @param {V} v2 The second value to compare.
 * @param {GridSortCellParams<V>} cellParams1 The parameters of the first cell.
 * @param {GridSortCellParams<V>} cellParams2 The parameters of the second cell.
 * @returns {number} The result of the comparison. Returns negative if v1 < v2, positive if v1 > v2, 0 if equal.
 */
export type GridComparatorFn<V = any> = (
  v1: V,
  v2: V,
  cellParams1: GridSortCellParams<V>,
  cellParams2: GridSortCellParams<V>,
) => number;

/**
 * A factory function that returns a comparator based on the sort direction.
 * @param {GridSortDirection} sortDirection The direction of the sort.
 * @returns {GridComparatorFn<V> | undefined} The comparator function to use.
 * Returns undefined to skip sorting for that direction.
 */
export type GridComparatorFnFactory<V = any> = (
  sortDirection: GridSortDirection,
) => GridComparatorFn<V> | undefined;

/**
 * Column metadata for sorting configuration.
 * This is merged into the column definition type.
 */
export interface SortingColumnMeta<V = any> {
  /**
   * If `false`, the column is not sortable.
   * @default true
   */
  sortable?: boolean;
  /**
   * A comparator function or factory for sorting column values.
   * Can be either:
   * - A direct comparator function: `(v1, v2, params1, params2) => number`
   * - A factory that returns a comparator based on direction: `(direction) => comparatorFn`
   */
  sortComparator?: GridComparatorFn<V> | GridComparatorFnFactory<V>;
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder?: readonly GridSortDirection[];
  /**
   * A function to get the value to sort by from a row.
   * @param {any} row The row to get the value from.
   * @returns {V} The value to sort by.
   */
  sortValueGetter?: (row: any) => V;
}

export interface SortingState {
  sorting: {
    model: GridSortModel;
  };
}

export interface SortingOptions {
  initialState?: {
    sorting?: {
      model?: GridSortModel;
    };
  };

  sorting?: {
    /** The sort model for controlled mode. */
    model?: GridSortModel;

    /**
     * Callback fired when the sort model changes.
     * @param {GridSortModel} model The new sort model.
     */
    onModelChange?: (model: GridSortModel) => void;

    /**
     * The sorting mode: 'auto' or 'manual'.
     * In manual mode, the sorted row ids and not updated automatically after the sort model changes.
     * @default 'auto'
     */
    mode?: 'auto' | 'manual';

    /**
     * If true, multiple columns can be sorted at the same time.
     * @default true
     */
    multiSort?: boolean;

    /**
     * If true, sorting builds on the current sorted order.
     * @default false
     */
    stableSort?: boolean;

    /**
     * The default sorting order cycle.
     * @default ['asc', 'desc', null]
     */
    order?: readonly GridSortDirection[];
  };
}

/**
 * Internal options for the sorting plugin.
 */
export interface SortingInternalOptions {
  sorting?: {
    /** If true, sorting is handled externally (e.g., server-side). */
    external?: boolean;
  };
}

export interface ComputeSortedRowIdsOptions {
  /** Use stable sort - build on current sorted order instead of starting fresh. */
  stableSort?: boolean;
  /** Current sorted row IDs to use as base for stable sort. Defaults to state. */
  currentSortedRowIds?: GridRowId[];
}

export interface SortingApi {
  sorting: {
    /**
     * Get the current sort model.
     * @returns {GridSortModel} The current sort model.
     */
    getModel: () => GridSortModel;

    /**
     * Set the sort model.
     * @param {GridSortModel} model The new sort model.
     */
    setModel: (model: GridSortModel) => void;

    /**
     * Sort a column. Cycles through `sortingOrder` if direction is not provided.
     * @param {string} field The field to sort by.
     * @param {GridSortDirection} direction The direction to sort by.
     * @param {boolean} multiSort If true, multiple columns can be sorted at the same time.
     */
    sortColumn: (field: string, direction?: GridSortDirection, multiSort?: boolean) => void;

    /**
     * Apply sorting using the current sort model. Uses `computeSortedRowIds` internally.
     */
    apply: () => void;

    /**
     * Compute sorted row IDs without updating state.
     * @param {GridRowId[]} rowIds The row IDs to sort.
     * @param {GridSortModel} sortModel The sort model to use.
     * @param {ComputeSortedRowIdsOptions} options The options to use.
     * @returns {GridRowId[]} The sorted row IDs.
     */
    computeSortedRowIds: (
      rowIds?: GridRowId[],
      sortModel?: GridSortModel,
      options?: ComputeSortedRowIdsOptions,
    ) => GridRowId[];
  };
}
