import { describe, it, expect } from 'vitest';
import { isFilterGroup, isFilterCondition, EMPTY_FILTER_MODEL } from './types';
import type {
  FilterCondition,
  FilterGroup,
  FilterModel,
  FilterOperator,
} from './types';
import type { GridRowId } from '../internal/rows/rowUtils';
import { getStringFilterOperators } from './filterOperators/stringOperators';
import { getNumericFilterOperators } from './filterOperators/numericOperators';
import { getDateFilterOperators } from './filterOperators/dateOperators';
import { getBooleanFilterOperators } from './filterOperators/booleanOperators';
import { getSingleSelectFilterOperators } from './filterOperators/singleSelectOperators';
import { buildFilterApplier } from './filteringUtils';

// ================================
// Type Guards
// ================================

describe('Type Guards', () => {
  describe('isFilterGroup', () => {
    it('should return true for a FilterGroup', () => {
      const group: FilterGroup = { logicOperator: 'and', conditions: [] };
      expect(isFilterGroup(group)).toBe(true);
    });

    it('should return false for a FilterCondition', () => {
      const condition: FilterCondition = { field: 'name', operator: 'contains', value: 'test' };
      expect(isFilterGroup(condition)).toBe(false);
    });
  });

  describe('isFilterCondition', () => {
    it('should return true for a FilterCondition', () => {
      const condition: FilterCondition = { field: 'name', operator: 'contains', value: 'test' };
      expect(isFilterCondition(condition)).toBe(true);
    });

    it('should return false for a FilterGroup', () => {
      const group: FilterGroup = { logicOperator: 'and', conditions: [] };
      expect(isFilterCondition(group)).toBe(false);
    });
  });

  describe('EMPTY_FILTER_MODEL', () => {
    it('should be a group with and logic and no conditions', () => {
      expect(EMPTY_FILTER_MODEL.logicOperator).toBe('and');
      expect(EMPTY_FILTER_MODEL.conditions).toEqual([]);
    });
  });
});

// ================================
// Helper: get operator applier
// ================================

function getOperatorApplier(
  operators: FilterOperator[],
  operatorValue: string,
  filterValue?: any,
) {
  const operator = operators.find((op) => op.value === operatorValue)!;
  expect(operator).toBeDefined();
  return operator.getApplyFilterFn({ field: 'test', operator: operatorValue, value: filterValue });
}

// ================================
// String Operators
// ================================

describe('String Filter Operators', () => {
  const operators = getStringFilterOperators();

  describe('contains', () => {
    it('should match substring', () => {
      const fn = getOperatorApplier(operators, 'contains', 'lic')!;
      expect(fn('Alice', {})).toBe(true);
      expect(fn('Bob', {})).toBe(false);
    });

    it('should be case insensitive', () => {
      const fn = getOperatorApplier(operators, 'contains', 'ALICE')!;
      expect(fn('alice', {})).toBe(true);
    });

    it('should return null for empty value', () => {
      expect(getOperatorApplier(operators, 'contains', '')).toBe(null);
      expect(getOperatorApplier(operators, 'contains', undefined)).toBe(null);
    });

    it('should return false for null cell values', () => {
      const fn = getOperatorApplier(operators, 'contains', 'test')!;
      expect(fn(null, {})).toBe(false);
      expect(fn(undefined, {})).toBe(false);
    });
  });

  describe('doesNotContain', () => {
    it('should not match substring', () => {
      const fn = getOperatorApplier(operators, 'doesNotContain', 'lic')!;
      expect(fn('Alice', {})).toBe(false);
      expect(fn('Bob', {})).toBe(true);
    });

    it('should return true for null cell values', () => {
      const fn = getOperatorApplier(operators, 'doesNotContain', 'test')!;
      expect(fn(null, {})).toBe(true);
    });
  });

  describe('equals', () => {
    it('should match exact value (case insensitive)', () => {
      const fn = getOperatorApplier(operators, 'equals', 'alice')!;
      expect(fn('Alice', {})).toBe(true);
      expect(fn('Bob', {})).toBe(false);
    });
  });

  describe('doesNotEqual', () => {
    it('should not match exact value', () => {
      const fn = getOperatorApplier(operators, 'doesNotEqual', 'alice')!;
      expect(fn('Alice', {})).toBe(false);
      expect(fn('Bob', {})).toBe(true);
    });
  });

  describe('startsWith', () => {
    it('should match prefix', () => {
      const fn = getOperatorApplier(operators, 'startsWith', 'Ali')!;
      expect(fn('Alice', {})).toBe(true);
      expect(fn('Bob', {})).toBe(false);
    });

    it('should return false for null values', () => {
      const fn = getOperatorApplier(operators, 'startsWith', 'test')!;
      expect(fn(null, {})).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('should match suffix', () => {
      const fn = getOperatorApplier(operators, 'endsWith', 'ice')!;
      expect(fn('Alice', {})).toBe(true);
      expect(fn('Bob', {})).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should match null, undefined, and empty string', () => {
      const fn = getOperatorApplier(operators, 'isEmpty')!;
      expect(fn(null, {})).toBe(true);
      expect(fn(undefined, {})).toBe(true);
      expect(fn('', {})).toBe(true);
      expect(fn('hello', {})).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should not match null, undefined, and empty string', () => {
      const fn = getOperatorApplier(operators, 'isNotEmpty')!;
      expect(fn(null, {})).toBe(false);
      expect(fn(undefined, {})).toBe(false);
      expect(fn('', {})).toBe(false);
      expect(fn('hello', {})).toBe(true);
    });
  });

  describe('isAnyOf', () => {
    it('should match any of the values', () => {
      const fn = getOperatorApplier(operators, 'isAnyOf', ['Alice', 'Bob'])!;
      expect(fn('Alice', {})).toBe(true);
      expect(fn('Bob', {})).toBe(true);
      expect(fn('Charlie', {})).toBe(false);
    });

    it('should return null for empty array', () => {
      expect(getOperatorApplier(operators, 'isAnyOf', [])).toBe(null);
    });
  });
});

// ================================
// Numeric Operators
// ================================

describe('Numeric Filter Operators', () => {
  const operators = getNumericFilterOperators();

  describe('=', () => {
    it('should match equal values', () => {
      const fn = getOperatorApplier(operators, '=', 25)!;
      expect(fn(25, {})).toBe(true);
      expect(fn(30, {})).toBe(false);
    });

    it('should return null for null/NaN value', () => {
      expect(getOperatorApplier(operators, '=', null)).toBe(null);
      expect(getOperatorApplier(operators, '=', NaN)).toBe(null);
    });
  });

  describe('!=', () => {
    it('should match unequal values', () => {
      const fn = getOperatorApplier(operators, '!=', 25)!;
      expect(fn(25, {})).toBe(false);
      expect(fn(30, {})).toBe(true);
    });
  });

  describe('>', () => {
    it('should match greater values', () => {
      const fn = getOperatorApplier(operators, '>', 25)!;
      expect(fn(30, {})).toBe(true);
      expect(fn(25, {})).toBe(false);
      expect(fn(20, {})).toBe(false);
    });

    it('should return false for null cell value', () => {
      const fn = getOperatorApplier(operators, '>', 25)!;
      expect(fn(null, {})).toBe(false);
    });
  });

  describe('>=', () => {
    it('should match greater or equal values', () => {
      const fn = getOperatorApplier(operators, '>=', 25)!;
      expect(fn(30, {})).toBe(true);
      expect(fn(25, {})).toBe(true);
      expect(fn(20, {})).toBe(false);
    });
  });

  describe('<', () => {
    it('should match lesser values', () => {
      const fn = getOperatorApplier(operators, '<', 25)!;
      expect(fn(20, {})).toBe(true);
      expect(fn(25, {})).toBe(false);
      expect(fn(30, {})).toBe(false);
    });
  });

  describe('<=', () => {
    it('should match lesser or equal values', () => {
      const fn = getOperatorApplier(operators, '<=', 25)!;
      expect(fn(20, {})).toBe(true);
      expect(fn(25, {})).toBe(true);
      expect(fn(30, {})).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should match null values', () => {
      const fn = getOperatorApplier(operators, 'isEmpty')!;
      expect(fn(null, {})).toBe(true);
      expect(fn(undefined, {})).toBe(true);
      expect(fn(0, {})).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should match non-null values', () => {
      const fn = getOperatorApplier(operators, 'isNotEmpty')!;
      expect(fn(null, {})).toBe(false);
      expect(fn(0, {})).toBe(true);
      expect(fn(25, {})).toBe(true);
    });
  });

  describe('isAnyOf', () => {
    it('should match any of the values', () => {
      const fn = getOperatorApplier(operators, 'isAnyOf', [25, 30])!;
      expect(fn(25, {})).toBe(true);
      expect(fn(30, {})).toBe(true);
      expect(fn(35, {})).toBe(false);
    });
  });
});

// ================================
// Boolean Operators
// ================================

describe('Boolean Filter Operators', () => {
  const operators = getBooleanFilterOperators();

  describe('is', () => {
    it('should match true', () => {
      const fn = getOperatorApplier(operators, 'is', true)!;
      expect(fn(true, {})).toBe(true);
      expect(fn(false, {})).toBe(false);
    });

    it('should match false', () => {
      const fn = getOperatorApplier(operators, 'is', false)!;
      expect(fn(false, {})).toBe(true);
      expect(fn(true, {})).toBe(false);
    });

    it('should handle string "true" value', () => {
      const fn = getOperatorApplier(operators, 'is', 'true')!;
      expect(fn(true, {})).toBe(true);
      expect(fn(false, {})).toBe(false);
    });

    it('should handle string "false" value', () => {
      const fn = getOperatorApplier(operators, 'is', 'false')!;
      expect(fn(false, {})).toBe(true);
      expect(fn(true, {})).toBe(false);
    });

    it('should return null for empty value', () => {
      expect(getOperatorApplier(operators, 'is', '')).toBe(null);
      expect(getOperatorApplier(operators, 'is', null)).toBe(null);
    });
  });
});

// ================================
// Date Operators
// ================================

describe('Date Filter Operators', () => {
  const operators = getDateFilterOperators();

  describe('is', () => {
    it('should match same date', () => {
      const fn = getOperatorApplier(operators, 'is', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 15), {})).toBe(true);
      expect(fn(new Date(2023, 0, 16), {})).toBe(false);
    });

    it('should return null for empty value', () => {
      expect(getOperatorApplier(operators, 'is', '')).toBe(null);
    });

    it('should return false for null cell value', () => {
      const fn = getOperatorApplier(operators, 'is', '2023-01-15')!;
      expect(fn(null as any, {})).toBe(false);
    });
  });

  describe('not', () => {
    it('should not match same date', () => {
      const fn = getOperatorApplier(operators, 'not', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 15), {})).toBe(false);
      expect(fn(new Date(2023, 0, 16), {})).toBe(true);
    });
  });

  describe('after', () => {
    it('should match dates after', () => {
      const fn = getOperatorApplier(operators, 'after', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 16), {})).toBe(true);
      expect(fn(new Date(2023, 0, 15), {})).toBe(false);
      expect(fn(new Date(2023, 0, 14), {})).toBe(false);
    });
  });

  describe('onOrAfter', () => {
    it('should match dates on or after', () => {
      const fn = getOperatorApplier(operators, 'onOrAfter', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 16), {})).toBe(true);
      expect(fn(new Date(2023, 0, 15), {})).toBe(true);
      expect(fn(new Date(2023, 0, 14), {})).toBe(false);
    });
  });

  describe('before', () => {
    it('should match dates before', () => {
      const fn = getOperatorApplier(operators, 'before', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 14), {})).toBe(true);
      expect(fn(new Date(2023, 0, 15), {})).toBe(false);
      expect(fn(new Date(2023, 0, 16), {})).toBe(false);
    });
  });

  describe('onOrBefore', () => {
    it('should match dates on or before', () => {
      const fn = getOperatorApplier(operators, 'onOrBefore', '2023-01-15')!;
      expect(fn(new Date(2023, 0, 14), {})).toBe(true);
      expect(fn(new Date(2023, 0, 15), {})).toBe(true);
      expect(fn(new Date(2023, 0, 16), {})).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should match null dates', () => {
      const fn = getOperatorApplier(operators, 'isEmpty')!;
      expect(fn(null as any, {})).toBe(true);
      expect(fn(new Date(), {})).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should match non-null dates', () => {
      const fn = getOperatorApplier(operators, 'isNotEmpty')!;
      expect(fn(null as any, {})).toBe(false);
      expect(fn(new Date(), {})).toBe(true);
    });
  });
});

// ================================
// Single Select Operators
// ================================

describe('SingleSelect Filter Operators', () => {
  const operators = getSingleSelectFilterOperators();

  describe('is', () => {
    it('should match exact value', () => {
      const fn = getOperatorApplier(operators, 'is', 'cat')!;
      expect(fn('cat', {})).toBe(true);
      expect(fn('dog', {})).toBe(false);
    });

    it('should return null for empty value', () => {
      expect(getOperatorApplier(operators, 'is', '')).toBe(null);
      expect(getOperatorApplier(operators, 'is', null)).toBe(null);
    });
  });

  describe('not', () => {
    it('should not match exact value', () => {
      const fn = getOperatorApplier(operators, 'not', 'cat')!;
      expect(fn('cat', {})).toBe(false);
      expect(fn('dog', {})).toBe(true);
    });
  });

  describe('isAnyOf', () => {
    it('should match any of the values', () => {
      const fn = getOperatorApplier(operators, 'isAnyOf', ['cat', 'dog'])!;
      expect(fn('cat', {})).toBe(true);
      expect(fn('dog', {})).toBe(true);
      expect(fn('bird', {})).toBe(false);
    });

    it('should return null for empty array', () => {
      expect(getOperatorApplier(operators, 'isAnyOf', [])).toBe(null);
    });
  });
});

// ================================
// buildFilterApplier
// ================================

describe('buildFilterApplier', () => {
  const rows = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
    { id: 4, name: 'Diana', age: 25 },
  ];

  const stringOperators = getStringFilterOperators();
  const numericOperators = getNumericFilterOperators();

  const columnLookup: Record<string, any> = {
    name: { field: 'name', filterOperators: stringOperators },
    age: { field: 'age', filterOperators: numericOperators },
  };

  const getColumn = (field: string) => columnLookup[field];
  const getRow = (id: GridRowId) => rows.find((r) => r.id === id)!;
  const rowIds = rows.map((r) => r.id);

  describe('empty model', () => {
    it('should return null for empty model', () => {
      const applier = buildFilterApplier({
        model: EMPTY_FILTER_MODEL,
        getColumn,
        getRow,
      });
      expect(applier).toBe(null);
    });
  });

  describe('single condition', () => {
    it('should filter by a single string condition', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'contains', value: 'li' }],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([1, 3]); // Alice, Charlie
    });

    it('should filter by a single numeric condition', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'age', operator: '>', value: 25 }],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([2, 3]); // Bob(30), Charlie(35)
    });
  });

  describe('AND group', () => {
    it('should require all conditions to pass', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'li' },
          { field: 'age', operator: '>', value: 30 },
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([3]); // Charlie (contains 'li' AND age > 30)
    });
  });

  describe('OR group', () => {
    it('should pass if any condition passes', () => {
      const model: FilterModel = {
        logicOperator: 'or',
        conditions: [
          { field: 'name', operator: 'equals', value: 'Bob' },
          { field: 'age', operator: '=', value: 25 },
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([1, 2, 4]); // Alice(25), Bob, Diana(25)
    });
  });

  describe('nested groups', () => {
    it('should support nested AND/OR groups', () => {
      // (name contains "li") AND (age = 25 OR age = 35)
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'li' },
          {
            logicOperator: 'or',
            conditions: [
              { field: 'age', operator: '=', value: 25 },
              { field: 'age', operator: '=', value: 35 },
            ],
          },
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      // Alice (contains 'li', age=25), Charlie (contains 'li', age=35)
      expect(applier(rowIds)).toEqual([1, 3]);
    });

    it('should support deeply nested groups', () => {
      // (name = Alice) OR ((age > 30) AND (name startsWith "C"))
      const model: FilterModel = {
        logicOperator: 'or',
        conditions: [
          { field: 'name', operator: 'equals', value: 'Alice' },
          {
            logicOperator: 'and',
            conditions: [
              { field: 'age', operator: '>', value: 30 },
              { field: 'name', operator: 'startsWith', value: 'C' },
            ],
          },
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([1, 3]); // Alice, Charlie
    });
  });

  describe('invalid conditions', () => {
    it('should return null when all conditions are invalid', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'nonexistent', operator: 'contains', value: 'test' }],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow });
      expect(applier).toBe(null);
    });

    it('should skip invalid conditions and apply valid ones', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'nonexistent', operator: 'contains', value: 'test' },
          { field: 'name', operator: 'contains', value: 'Alice' },
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([1]); // Alice
    });

    it('should handle conditions with no value for operators that require it', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'contains', value: '' }],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow });
      expect(applier).toBe(null);
    });
  });

  describe('filterValueGetter', () => {
    it('should use filterValueGetter when provided', () => {
      const columnWithGetter: Record<string, any> = {
        name: {
          field: 'name',
          filterOperators: stringOperators,
          filterValueGetter: (row: any) => row.name.toLowerCase(),
        },
      };
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'startsWith', value: 'alice' }],
      };
      const applier = buildFilterApplier({
        model,
        getColumn: (field) => columnWithGetter[field],
        getRow,
      })!;
      expect(applier(rowIds)).toEqual([1]); // Alice (lowercase getter matches 'alice')
    });
  });

  describe('non-filterable columns', () => {
    it('should skip conditions on non-filterable columns', () => {
      const columnsWithNonFilterable: Record<string, any> = {
        name: { field: 'name', filterOperators: stringOperators, filterable: false },
        age: { field: 'age', filterOperators: numericOperators },
      };
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'Alice' },
          { field: 'age', operator: '>', value: 20 },
        ],
      };
      const applier = buildFilterApplier({
        model,
        getColumn: (field) => columnsWithNonFilterable[field],
        getRow,
      })!;
      // name condition is skipped (non-filterable), only age > 20 applies
      expect(applier(rowIds)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('eval vs no-eval parity', () => {
    it('should produce identical results with disableEval', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'li' },
          { field: 'age', operator: '>', value: 25 },
        ],
      };

      const applierWithEval = buildFilterApplier({
        model,
        getColumn,
        getRow,
        disableEval: false,
      })!;
      const applierWithoutEval = buildFilterApplier({
        model,
        getColumn,
        getRow,
        disableEval: true,
      })!;

      expect(applierWithEval(rowIds)).toEqual(applierWithoutEval(rowIds));
    });

    it('should produce identical results for OR groups', () => {
      const model: FilterModel = {
        logicOperator: 'or',
        conditions: [
          { field: 'name', operator: 'equals', value: 'Alice' },
          { field: 'age', operator: '=', value: 35 },
        ],
      };

      const applierWithEval = buildFilterApplier({
        model,
        getColumn,
        getRow,
        disableEval: false,
      })!;
      const applierWithoutEval = buildFilterApplier({
        model,
        getColumn,
        getRow,
        disableEval: true,
      })!;

      expect(applierWithEval(rowIds)).toEqual(applierWithoutEval(rowIds));
    });
  });
});
