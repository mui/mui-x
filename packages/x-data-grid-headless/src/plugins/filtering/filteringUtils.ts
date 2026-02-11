import type { GridRowId } from '../internal/rows/rowUtils';
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

// ================================
// Eval Detection
// ================================

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

// ================================
// Condition Applier
// ================================

interface ConditionApplier {
  fn: (row: any) => boolean;
}

interface ColumnInfo {
  field?: string | number | symbol;
  id?: string;
  filterable?: boolean;
  filterOperators?: FilterOperator[];
  filterValueGetter?: (row: any) => any;
}

function getConditionApplier(
  condition: FilterCondition,
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined,
  _getRow: (id: GridRowId) => any,
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

  const filterOperators = column.filterOperators;
  if (!filterOperators?.length) {
    return null;
  }

  const filterOperator = filterOperators.find((op) => op.value === condition.operator);
  if (!filterOperator) {
    return null;
  }

  const applyFilterOnRow = filterOperator.getApplyFilterFn(condition);
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
      return applyFilterOnRow(value, row);
    },
  };
}

// ================================
// Group Applier (Recursive)
// ================================

type GroupApplierFn = (row: any) => boolean;

function buildGroupApplier(
  group: FilterGroup,
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined,
  getRow: (id: GridRowId) => any,
  disableEval: boolean,
): GroupApplierFn | null {
  const appliers: GroupApplierFn[] = [];

  for (const child of group.conditions) {
    if (isFilterCondition(child)) {
      const conditionApplier = getConditionApplier(child, getColumn, getRow);
      if (conditionApplier) {
        appliers.push(conditionApplier.fn);
      }
    } else if (isFilterGroup(child)) {
      const nestedApplier = buildGroupApplier(child, getColumn, getRow, disableEval);
      if (nestedApplier) {
        appliers.push(nestedApplier);
      }
    }
  }

  if (appliers.length === 0) {
    return null;
  }

  // Check if this is a flat group (all children are conditions, no nested groups)
  const isFlatGroup = group.conditions.every(
    (child: FilterExpression) => isFilterCondition(child),
  );

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

// ================================
// Top-Level Entry Point
// ================================

interface BuildFilterApplierParams {
  model: FilterModel;
  getColumn: (field: string) => (ColumnInfo & FilteringColumnMeta) | undefined;
  getRow: (id: GridRowId) => any;
  disableEval?: boolean;
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
}: BuildFilterApplierParams): ((rowIds: GridRowId[]) => GridRowId[]) | null => {
  if (!model.conditions || model.conditions.length === 0) {
    return null;
  }

  const groupApplier = buildGroupApplier(model, getColumn, getRow, disableEval);
  if (!groupApplier) {
    return null;
  }

  return (rowIds: GridRowId[]) => {
    return rowIds.filter((id) => {
      const row = getRow(id);
      return groupApplier(row);
    });
  };
};
