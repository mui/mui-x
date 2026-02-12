import type { GridRowId } from '../internal/rows/rowUtils';

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
 * The root filter model is always a group, with optional quick filter fields.
 */
export type FilterModel = FilterGroup & {
  quickFilterValues?: any[];
  quickFilterLogicOperator?: 'and' | 'or';
  quickFilterExcludeHiddenColumns?: boolean;
};

export const EMPTY_FILTER_MODEL: FilterModel = { logicOperator: 'and', conditions: [] };

export function isFilterGroup(expr: FilterExpression): expr is FilterGroup {
  return 'logicOperator' in expr && 'conditions' in expr;
}

export function isFilterCondition(expr: FilterExpression): expr is FilterCondition {
  return 'field' in expr && 'operator' in expr;
}

export interface FilterOperator<V = any> {
  value: string;
  label?: string;
  getApplyFilterFn: (condition: FilterCondition) => null | ((cellValue: V, row: any) => boolean);
  /**
   * A function that returns a filter function for quick filter matching.
   * @param {any} quickFilterValue The quick filter value to match against.
   * @returns {null | ((cellValue: V, row: any) => boolean)} The filter function or null if not applicable.
   */
  getApplyQuickFilterFn?: (quickFilterValue: any) => null | ((cellValue: V, row: any) => boolean);
  /**
   * A function that returns a string representation of the filter value.
   * @param {any} value The filter value.
   * @returns {string} The string representation.
   */
  getValueAsString?: (value: any) => string;
  /**
   * If `false`, the operator does not require a filter value (e.g. isEmpty, isNotEmpty).
   * @default true
   */
  requiresFilterValue?: boolean;
}

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
  /**
   * A function to parse the filter value before applying the filter.
   * @param {any} value The raw filter value.
   * @returns {any} The parsed filter value.
   */
  valueParser?: (value: any) => any;
  /**
   * A function that returns a filter function for quick filter matching at the column level.
   * Takes precedence over the operator-level `getApplyQuickFilterFn`.
   * @param {any} quickFilterValue The quick filter value to match against.
   * @returns {null | ((cellValue: V, row: any) => boolean)} The filter function or null if not applicable.
   */
  getApplyQuickFilterFn?: (quickFilterValue: any) => null | ((cellValue: V, row: any) => boolean);
}

export interface FilteringState {
  filtering: {
    model: FilterModel;
    filteredRowIds: GridRowId[];
  };
}

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

export type FilteringSelectors = {
  model: (state: FilteringState) => FilterModel;
  filteredRowIds: (state: FilteringState) => GridRowId[];
  quickFilterValues: (state: FilteringState) => any[];
};

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

    /**
     * Upsert a filter condition in the root group.
     * If a condition with the same field and operator exists, its value is updated.
     * Otherwise, the condition is appended.
     * @param {FilterCondition} condition The condition to upsert.
     */
    upsertCondition: (condition: FilterCondition) => void;

    /**
     * Delete a filter condition from the root group.
     * Matches by field and operator.
     * @param {FilterCondition} condition The condition to delete.
     */
    deleteCondition: (condition: FilterCondition) => void;

    /**
     * Set the quick filter values.
     * @param {any[]} values The quick filter values.
     */
    setQuickFilterValues: (values: any[]) => void;

    /**
     * Set the root logic operator.
     * @param {'and' | 'or'} operator The logic operator.
     */
    setLogicOperator: (operator: 'and' | 'or') => void;
  };
}
