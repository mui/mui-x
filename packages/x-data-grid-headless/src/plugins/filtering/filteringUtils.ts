import type { ColumnType } from '../../columnDef/columnDef';
import type { GridRowId } from '../internal/rows/types';
import {
  type FilterCondition,
  type FilterExpression,
  type FilterGroup,
  type FilterModel,
  type FilterOperator,
  type FilteringColumnMeta,
  isFilterCondition,
  isFilterGroup,
} from './types';
import { getStringFilterOperators } from './filterOperators/stringOperators';
import { getNumericFilterOperators } from './filterOperators/numericOperators';
import { getDateFilterOperators } from './filterOperators/dateOperators';
import { getBooleanFilterOperators } from './filterOperators/booleanOperators';
import { getSingleSelectFilterOperators } from './filterOperators/singleSelectOperators';

/**
 * Returns the default filter operators for the given column type.
 */
export function getDefaultFilterOperators(type: ColumnType = 'string'): FilterOperator[] {
  switch (type) {
    case 'number':
      return getNumericFilterOperators();
    case 'date':
      return getDateFilterOperators();
    case 'dateTime':
      return getDateFilterOperators(true);
    case 'boolean':
      return getBooleanFilterOperators();
    case 'singleSelect':
      return getSingleSelectFilterOperators();
    case 'string':
    default:
      return getStringFilterOperators();
  }
}

export function removeDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Remove filter conditions that reference fields not present in the valid fields set.
 * Returns the same model reference if no changes were needed.
 */
export function cleanFilterModel(
  model: FilterModel,
  isFieldValid: (field: string) => boolean,
): FilterModel {
  const cleaned = cleanConditions(model.conditions, isFieldValid);
  if (cleaned === model.conditions) {
    return model;
  }
  return { ...model, conditions: cleaned };
}

function cleanConditions(
  conditions: FilterExpression[],
  isFieldValid: (field: string) => boolean,
): FilterExpression[] {
  let changed = false;
  const result: FilterExpression[] = [];

  for (const expr of conditions) {
    if (isFilterCondition(expr)) {
      if (isFieldValid(expr.field)) {
        result.push(expr);
      } else {
        changed = true;
      }
    } else if (isFilterGroup(expr)) {
      const cleanedGroup = cleanFilterModel(expr, isFieldValid);
      if (cleanedGroup.conditions.length === 0) {
        changed = true;
      } else {
        if (cleanedGroup !== expr) {
          changed = true;
        }
        result.push(cleanedGroup);
      }
    }
  }

  if (!changed) {
    return conditions;
  }
  return result;
}

let hasEval: boolean;

function getHasEval() {
  if (hasEval !== undefined) {
    return hasEval;
  }

  try {
    // eslint-disable-next-line no-new-func
    hasEval = new Function('return true')() as boolean;
  } catch (_: unknown) {
    hasEval = false;
  }

  return hasEval;
}

interface ConditionApplier {
  fn: (row: any) => boolean;
}

interface ColumnInfo {
  field?: string | number | symbol;
  id?: string;
  type?: ColumnType;
  filterable?: boolean;
  filterOperators?: FilterOperator[];
  filterValueGetter?: (row: any) => any;
}

function getConditionApplier(
  condition: FilterCondition,
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined,
  _getRow: (id: GridRowId) => any,
  ignoreDiacritics: boolean,
): ConditionApplier | null {
  if (!condition.field || !condition.operator) {
    return null;
  }

  const column = getColumn(condition.field);
  if (!column) {
    return null;
  }

  if (column.filterable === false) {
    return null;
  }

  const filterOperators = column.filterOperators ?? getDefaultFilterOperators(column.type);
  if (!filterOperators?.length) {
    return null;
  }

  const filterOperator = filterOperators.find((op) => op.value === condition.operator);
  if (!filterOperator) {
    return null;
  }

  // Apply valueParser if present
  let effectiveCondition = condition;
  if (column.valueParser && condition.value !== undefined) {
    const parsedValue = Array.isArray(condition.value)
      ? condition.value.map(column.valueParser)
      : column.valueParser(condition.value);
    effectiveCondition = { ...condition, value: parsedValue };
  }

  // Normalize condition value for diacritics if needed
  if (ignoreDiacritics && typeof effectiveCondition.value === 'string') {
    effectiveCondition = {
      ...effectiveCondition,
      value: removeDiacritics(effectiveCondition.value),
    };
  }

  const applyFilterOnRow = filterOperator.getApplyFilterFn(effectiveCondition);
  if (typeof applyFilterOnRow !== 'function') {
    return null;
  }

  const fieldKey = column.field ?? column.id;

  return {
    fn: (row: any) => {
      let value;
      if (column.filterValueGetter) {
        value = column.filterValueGetter(row);
      } else {
        value = fieldKey ? row[fieldKey as string] : undefined;
      }
      // Normalize cell value for diacritics if needed
      if (ignoreDiacritics && typeof value === 'string') {
        value = removeDiacritics(value);
      }
      return applyFilterOnRow(value, row);
    },
  };
}

type GroupApplierFn = (row: any) => boolean;

function buildGroupApplier(
  group: FilterGroup,
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined,
  getRow: (id: GridRowId) => any,
  disableEval: boolean,
  ignoreDiacritics: boolean,
): GroupApplierFn | null {
  const appliers: GroupApplierFn[] = [];

  for (const child of group.conditions) {
    if (isFilterCondition(child)) {
      const conditionApplier = getConditionApplier(child, getColumn, getRow, ignoreDiacritics);
      if (conditionApplier) {
        appliers.push(conditionApplier.fn);
      }
    } else if (isFilterGroup(child)) {
      const nestedApplier = buildGroupApplier(
        child,
        getColumn,
        getRow,
        disableEval,
        ignoreDiacritics,
      );
      if (nestedApplier) {
        appliers.push(nestedApplier);
      }
    }
  }

  if (appliers.length === 0) {
    return null;
  }

  // Check if this is a flat group (all children are conditions, no nested groups)
  const isFlatGroup = group.conditions.every((child: FilterExpression) => isFilterCondition(child));

  // Use eval optimization for flat groups when eval is available and not disabled
  if (isFlatGroup && !disableEval && getHasEval()) {
    return buildEvalGroupApplier(appliers, group.logicOperator);
  }

  // Standard loop-based approach
  if (group.logicOperator === 'and') {
    return (row: any) => appliers.every((applier) => applier(row));
  }
  return (row: any) => appliers.some((applier) => applier(row));
}

/**
 * Build a group applier using eval/new Function() for performance.
 * Pre-compiles the logic operator chain into a single function.
 */
function buildEvalGroupApplier(
  appliers: GroupApplierFn[],
  logicOperator: 'and' | 'or',
): GroupApplierFn {
  const operator = logicOperator === 'and' ? '&&' : '||';

  // eslint-disable-next-line no-new-func
  const filterFn = new Function(
    'appliers',
    'row',
    `"use strict";
return ${appliers.map((_, i) => `appliers[${i}](row)`).join(` ${operator} `)};`,
  );

  return (row: any) => filterFn(appliers, row);
}

type QuickFilterApplierFn = (row: any) => boolean;

function buildQuickFilterApplier(
  model: FilterModel,
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined,
  ignoreDiacritics: boolean,
  getAllColumnFields?: () => string[],
  getVisibleColumnFields?: () => string[],
): QuickFilterApplierFn | null {
  const quickFilterValues = model.quickFilterValues;
  if (!quickFilterValues || quickFilterValues.length === 0) {
    return null;
  }

  const excludeHidden = model.quickFilterExcludeHiddenColumns !== false;
  const columnFields = excludeHidden
    ? (getVisibleColumnFields?.() ?? getAllColumnFields?.() ?? [])
    : (getAllColumnFields?.() ?? []);

  if (columnFields.length === 0) {
    return null;
  }

  // For each column, resolve the quick filter function
  type ColumnQuickFilterFn = (
    quickFilterValue: any,
  ) => null | ((cellValue: any, row: any) => boolean);

  const columnQuickFilterFns: Array<{
    field: string;
    getQuickFilterFn: ColumnQuickFilterFn;
    column: ColumnInfo & FilteringColumnMeta;
  }> = [];

  for (const field of columnFields) {
    const column = getColumn(field);
    if (!column || column.filterable === false) {
      continue;
    }

    // Column-level getApplyQuickFilterFn takes precedence
    let getQuickFilterFn: ColumnQuickFilterFn | undefined = column.getApplyQuickFilterFn;

    if (!getQuickFilterFn) {
      // Fall back to first operator with getApplyQuickFilterFn
      const filterOperators = column.filterOperators ?? getDefaultFilterOperators(column.type);
      const operatorWithQuickFilter = filterOperators?.find((op) => op.getApplyQuickFilterFn);
      if (operatorWithQuickFilter) {
        getQuickFilterFn = operatorWithQuickFilter.getApplyQuickFilterFn;
      }
    }

    if (getQuickFilterFn) {
      columnQuickFilterFns.push({ field, getQuickFilterFn, column });
    }
  }

  if (columnQuickFilterFns.length === 0) {
    return null;
  }

  const quickFilterLogicOperator = model.quickFilterLogicOperator ?? 'and';

  // Pre-compute the filter functions for each value/column combination
  const valueFilters: Array<
    Array<{
      filterFn: (cellValue: any, row: any) => boolean;
      column: ColumnInfo & FilteringColumnMeta;
    }>
  > = [];

  for (const quickFilterValue of quickFilterValues) {
    const columnFilters: Array<{
      filterFn: (cellValue: any, row: any) => boolean;
      column: ColumnInfo & FilteringColumnMeta;
    }> = [];

    for (const { getQuickFilterFn, column } of columnQuickFilterFns) {
      const filterFn = getQuickFilterFn(quickFilterValue);
      if (filterFn) {
        columnFilters.push({ filterFn, column });
      }
    }

    valueFilters.push(columnFilters);
  }

  return (row: any): boolean => {
    // For each quick filter value, check if ANY column matches
    const valueResults = valueFilters.map((columnFilters) => {
      if (columnFilters.length === 0) {
        return false;
      }
      return columnFilters.some(({ filterFn, column }) => {
        const fieldKey = column.field ?? column.id;
        let value;
        if (column.filterValueGetter) {
          value = column.filterValueGetter(row);
        } else {
          value = fieldKey ? row[fieldKey as string] : undefined;
        }
        if (ignoreDiacritics && typeof value === 'string') {
          value = removeDiacritics(value);
        }
        return filterFn(value, row);
      });
    });

    // Combine value results with logic operator
    if (quickFilterLogicOperator === 'and') {
      return valueResults.every(Boolean);
    }
    return valueResults.some(Boolean);
  };
}

interface BuildFilterApplierParams {
  model: FilterModel;
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined;
  getRow: (id: GridRowId) => any;
  disableEval?: boolean;
  ignoreDiacritics?: boolean;
  getAllColumnFields?: () => string[];
  getVisibleColumnFields?: () => string[];
}

/**
 * Build a function that filters row IDs according to the filter model.
 * @returns A function that takes row IDs and returns filtered row IDs, or null if no filtering.
 */
export const buildFilterApplier = ({
  model,
  getColumn,
  getRow,
  disableEval = false,
  ignoreDiacritics = false,
  getAllColumnFields,
  getVisibleColumnFields,
}: BuildFilterApplierParams): ((rowIds: GridRowId[]) => GridRowId[]) | null => {
  const hasConditions = model.conditions && model.conditions.length > 0;
  const hasQuickFilter = model.quickFilterValues && model.quickFilterValues.length > 0;

  if (!hasConditions && !hasQuickFilter) {
    return null;
  }

  const groupApplier = hasConditions
    ? buildGroupApplier(model, getColumn, getRow, disableEval, ignoreDiacritics)
    : null;

  const quickFilterApplier = hasQuickFilter
    ? buildQuickFilterApplier(
        model,
        getColumn,
        ignoreDiacritics,
        getAllColumnFields,
        getVisibleColumnFields,
      )
    : null;

  if (!groupApplier && !quickFilterApplier) {
    return null;
  }

  return (rowIds: GridRowId[]) => {
    return rowIds.filter((id) => {
      const row = getRow(id);
      if (groupApplier && !groupApplier(row)) {
        return false;
      }
      if (quickFilterApplier && !quickFilterApplier(row)) {
        return false;
      }
      return true;
    });
  };
};
