import type { GridRowId } from '../internal/rows/rowUtils';

// ================================
// Filter Model Types (Recursive Groups)
// ================================

export interface FilterCondition {
  field: string;
  operator: string;
  value?: any;
}

export interface FilterGroup {
  logicOperator: 'and' | 'or';
  conditions: FilterExpression[];
}

export type FilterExpression = FilterCondition | FilterGroup;

/**
 * The root filter model is always a group.
 */
export type FilterModel = FilterGroup;

export const EMPTY_FILTER_MODEL: FilterModel = { logicOperator: 'and', conditions: [] };

// ================================
// Type Guards
// ================================

export function isFilterGroup(expr: FilterExpression): expr is FilterGroup {
  return 'logicOperator' in expr && 'conditions' in expr;
}

export function isFilterCondition(expr: FilterExpression): expr is FilterCondition {
  return 'field' in expr && 'operator' in expr;
}

// ================================
// Filter Operators
// ================================

export interface FilterOperator<V = any> {
  value: string;
  label?: string;
  getApplyFilterFn: (condition: FilterCondition) => null | ((cellValue: V, row: any) => boolean);
  /**
   * If `false`, the operator does not require a filter value (e.g. isEmpty, isNotEmpty).
   * @default true
   */
  requiresFilterValue?: boolean;
}

// ================================
// Column Metadata
// ================================

export interface FilteringColumnMeta<V = any> {
  /**
   * If `false`, the column is not filterable.
   * @default true
   */
  filterable?: boolean;
  /**
   * The filter operators available for this column.
   * If not provided, default operators are determined by the column `type`.
   */
  filterOperators?: FilterOperator<V>[];
  /**
   * A function to get the value to filter by from a row.
   * @param {any} row The row to get the value from.
   * @returns {V} The value to filter by.
   */
  filterValueGetter?: (row: any) => V;
  /**
   * The value options for singleSelect columns.
   */
  valueOptions?: Array<string | { value: any; label: string }>;
}

// ================================
// Plugin State
// ================================

export interface FilteringState {
  filtering: {
    model: FilterModel;
    filteredRowIds: GridRowId[];
  };
}

// ================================
// Plugin Options
// ================================

export interface FilteringOptions {
  initialState?: {
    filtering?: {
      model?: FilterModel;
    };
  };

  filtering?: {
    /** The filter model for controlled mode. */
    model?: FilterModel;

    /**
     * Callback fired when the filter model changes.
     * @param {FilterModel} model The new filter model.
     */
    onModelChange?: (model: FilterModel) => void;

    /**
     * The filtering mode: 'auto' or 'manual'.
     * In manual mode, filtered row IDs are not updated automatically after the filter model changes.
     * @default 'auto'
     */
    mode?: 'auto' | 'manual';

    /**
     * If true, disables the eval optimization for filter appliers.
     * @default false
     */
    disableEval?: boolean;

    /**
     * If true, removes diacritics (accents) from string values before filtering.
     * @default false
     */
    ignoreDiacritics?: boolean;
  };
}

/**
 * Internal options for the filtering plugin.
 */
export interface FilteringInternalOptions {
  filtering?: {
    /** If true, filtering is handled externally (e.g., server-side). */
    external?: boolean;
  };
}

// ================================
// Selectors
// ================================

export type FilteringSelectors = {
  model: (state: FilteringState) => FilterModel;
  filteredRowIds: (state: FilteringState) => GridRowId[];
};

// ================================
// API
// ================================

export interface FilteringApi {
  filtering: {
    /**
     * Get the current filter model.
     * @returns {FilterModel} The current filter model.
     */
    getModel: () => FilterModel;

    /**
     * Set the filter model.
     * @param {FilterModel} model The new filter model.
     */
    setModel: (model: FilterModel) => void;

    /**
     * Apply filtering using the current filter model.
     */
    apply: () => void;

    /**
     * Compute filtered row IDs without updating state.
     * @param {GridRowId[]} rowIds The row IDs to filter (defaults to current input rows).
     * @param {FilterModel} filterModel The filter model to use (defaults to current model).
     * @returns {GridRowId[]} The filtered row IDs.
     */
    computeFilteredRowIds: (rowIds?: GridRowId[], filterModel?: FilterModel) => GridRowId[];
  };
}
