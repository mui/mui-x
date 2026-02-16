import { describe, it, expect } from 'vitest';
import { isFilterGroup, isFilterCondition, EMPTY_FILTER_MODEL } from './types';
import type { FilterCondition, FilterGroup, FilterModel, FilterOperator } from './types';
import type { GridRowId } from '../internal/rows/types';
import {
  getStringFilterOperators,
  getStringQuickFilterFn,
} from './filterOperators/stringOperators';
import {
  getNumericFilterOperators,
  getNumericQuickFilterFn,
} from './filterOperators/numericOperators';
import { getDateFilterOperators } from './filterOperators/dateOperators';
import { getBooleanFilterOperators } from './filterOperators/booleanOperators';
import {
  getSingleSelectFilterOperators,
  getSingleSelectQuickFilterFn,
} from './filterOperators/singleSelectOperators';
import {
  buildFilterApplier,
  cleanFilterModel,
  removeDiacritics,
  getDefaultFilterOperators,
} from './filteringUtils';

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

function getOperatorApplier(operators: FilterOperator[], operatorValue: string, filterValue?: any) {
  const operator = operators.find((op) => op.value === operatorValue)!;
  expect(operator).toBeDefined();
  return operator.getApplyFilterFn({ field: 'test', operator: operatorValue, value: filterValue });
}

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

  describe('number cell values', () => {
    it('should convert numeric cell values to string for contains', () => {
      const fn = getOperatorApplier(operators, 'contains', '0')!;
      expect(fn(0, {})).toBe(true);
      expect(fn(1, {})).toBe(false);
      expect(fn(10, {})).toBe(true); // '10' contains '0'
    });

    it('should convert numeric cell values to string for equals', () => {
      const fn = getOperatorApplier(operators, 'equals', '0')!;
      expect(fn(0, {})).toBe(true);
      expect(fn(1, {})).toBe(false);
    });

    it('should convert numeric cell values to string for startsWith', () => {
      const fn = getOperatorApplier(operators, 'startsWith', '1')!;
      expect(fn(1, {})).toBe(true);
      expect(fn(10, {})).toBe(true);
      expect(fn(0, {})).toBe(false);
    });

    it('should convert numeric cell values to string for endsWith', () => {
      const fn = getOperatorApplier(operators, 'endsWith', '0')!;
      expect(fn(0, {})).toBe(true);
      expect(fn(10, {})).toBe(true);
      expect(fn(1, {})).toBe(false);
    });
  });

  describe('regex special characters', () => {
    it('should escape regex special chars in contains', () => {
      const fn = getOperatorApplier(operators, 'contains', '(fr)')!;
      expect(fn('France (fr)', {})).toBe(true);
      expect(fn('France fr', {})).toBe(false);
    });

    it('should return no matches for complex regex patterns', () => {
      const fn = getOperatorApplier(operators, 'contains', '[-[]{}()*+?.,\\^$|#s]')!;
      expect(fn('anything', {})).toBe(false);
    });

    it('should escape regex special chars in startsWith', () => {
      const fn = getOperatorApplier(operators, 'startsWith', 'France (')!;
      expect(fn('France (fr)', {})).toBe(true);
      expect(fn('France fr', {})).toBe(false);
    });

    it('should escape regex special chars in endsWith', () => {
      const fn = getOperatorApplier(operators, 'endsWith', '(fr)')!;
      expect(fn('France (fr)', {})).toBe(true);
      expect(fn('Francefr)', {})).toBe(false);
    });
  });

  describe('trimming', () => {
    it('should trim filter value for contains', () => {
      const fn = getOperatorApplier(operators, 'contains', ' Fra ')!;
      expect(fn('France', {})).toBe(true);
    });

    it('should trim filter value for equals', () => {
      const fn = getOperatorApplier(operators, 'equals', ' France ')!;
      expect(fn('France', {})).toBe(true);
    });

    it('should trim filter value for startsWith', () => {
      const fn = getOperatorApplier(operators, 'startsWith', ' Fra ')!;
      expect(fn('France', {})).toBe(true);
    });

    it('should trim filter value for endsWith', () => {
      const fn = getOperatorApplier(operators, 'endsWith', ' nce ')!;
      expect(fn('France', {})).toBe(true);
    });

    it('should trim isAnyOf values', () => {
      const fn = getOperatorApplier(operators, 'isAnyOf', [' France ', 'Germany '])!;
      expect(fn('France', {})).toBe(true);
      expect(fn('Germany', {})).toBe(true);
    });
  });
});

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

  describe('empty string value', () => {
    it('should return null for value: "" (all operators)', () => {
      expect(getOperatorApplier(operators, '=', '')).toBe(null);
      expect(getOperatorApplier(operators, '!=', '')).toBe(null);
      expect(getOperatorApplier(operators, '>', '')).toBe(null);
      expect(getOperatorApplier(operators, '>=', '')).toBe(null);
      expect(getOperatorApplier(operators, '<', '')).toBe(null);
      expect(getOperatorApplier(operators, '<=', '')).toBe(null);
    });
  });

  describe('undefined value', () => {
    it('should return null for value: undefined (all operators)', () => {
      expect(getOperatorApplier(operators, '=', undefined)).toBe(null);
      expect(getOperatorApplier(operators, '!=', undefined)).toBe(null);
      expect(getOperatorApplier(operators, '>', undefined)).toBe(null);
      expect(getOperatorApplier(operators, '>=', undefined)).toBe(null);
      expect(getOperatorApplier(operators, '<', undefined)).toBe(null);
      expect(getOperatorApplier(operators, '<=', undefined)).toBe(null);
    });
  });

  describe('non-numeric string value', () => {
    it('should return null for non-numeric string values', () => {
      expect(getOperatorApplier(operators, '=', 'abc')).toBe(null);
      expect(getOperatorApplier(operators, '>', 'xyz')).toBe(null);
    });
  });
});

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

  describe('case-insensitive string values', () => {
    it('should handle "TRUE" (uppercase)', () => {
      const fn = getOperatorApplier(operators, 'is', 'TRUE')!;
      expect(fn(true, {})).toBe(true);
      expect(fn(false, {})).toBe(false);
    });

    it('should handle "True" (title case)', () => {
      const fn = getOperatorApplier(operators, 'is', 'True')!;
      expect(fn(true, {})).toBe(true);
      expect(fn(false, {})).toBe(false);
    });

    it('should handle "FALSE" (uppercase)', () => {
      const fn = getOperatorApplier(operators, 'is', 'FALSE')!;
      expect(fn(false, {})).toBe(true);
      expect(fn(true, {})).toBe(false);
    });

    it('should handle "False" (title case)', () => {
      const fn = getOperatorApplier(operators, 'is', 'False')!;
      expect(fn(false, {})).toBe(true);
      expect(fn(true, {})).toBe(false);
    });
  });

  describe('invalid values', () => {
    it('should return null for invalid string values', () => {
      expect(getOperatorApplier(operators, 'is', 'test')).toBe(null);
      expect(getOperatorApplier(operators, 'is', 'yes')).toBe(null);
      expect(getOperatorApplier(operators, 'is', '1')).toBe(null);
    });
  });

  describe('null and undefined cell values', () => {
    it('should treat null as false', () => {
      const fnTrue = getOperatorApplier(operators, 'is', true)!;
      const fnFalse = getOperatorApplier(operators, 'is', false)!;
      expect(fnTrue(null, {})).toBe(false);
      expect(fnFalse(null, {})).toBe(true);
    });

    it('should treat undefined as false', () => {
      const fnTrue = getOperatorApplier(operators, 'is', true)!;
      const fnFalse = getOperatorApplier(operators, 'is', false)!;
      expect(fnTrue(undefined, {})).toBe(false);
      expect(fnFalse(undefined, {})).toBe(true);
    });
  });
});

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

  describe('dateTime (showTime=true)', () => {
    const dateTimeOperators = getDateFilterOperators(true);

    describe('is', () => {
      it('should match same dateTime', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'is', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 8, 30), {})).toBe(false);
      });

      it('should accept Date object as filter value', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'is', new Date(2001, 0, 1, 7, 30))!;
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(true);
      });
    });

    describe('not', () => {
      it('should not match same dateTime', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'not', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 6, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(false);
      });
    });

    describe('after', () => {
      it('should match dateTimes after', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'after', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 8, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(false);
        expect(fn(new Date(2001, 0, 1, 6, 30), {})).toBe(false);
      });
    });

    describe('onOrAfter', () => {
      it('should match dateTimes on or after', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'onOrAfter', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 8, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 6, 30), {})).toBe(false);
      });
    });

    describe('before', () => {
      it('should match dateTimes before', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'before', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 6, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(false);
        expect(fn(new Date(2001, 0, 1, 8, 30), {})).toBe(false);
      });
    });

    describe('onOrBefore', () => {
      it('should match dateTimes on or before', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'onOrBefore', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 6, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 8, 30), {})).toBe(false);
      });
    });

    describe('seconds handling', () => {
      it('after should use raw comparison with seconds when showTime is true', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'after', '2001-01-01T07:30')!;
        // With keepRawComparison, 7:30:30 > 7:30:00 is true
        expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 31, 0), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(false);
      });

      it('should match onOrAfter with raw comparison for seconds', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'onOrAfter', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 29, 30), {})).toBe(false);
      });

      it('should match before with raw comparison for seconds', () => {
        const fn = getOperatorApplier(dateTimeOperators, 'before', '2001-01-01T07:30')!;
        expect(fn(new Date(2001, 0, 1, 7, 29, 30), {})).toBe(true);
        expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(false);
        expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(false);
      });
    });
  });

  describe('filter value types', () => {
    it('should accept string date as filter value', () => {
      const fn = getOperatorApplier(operators, 'is', '2001-01-01')!;
      expect(fn(new Date(2001, 0, 1), {})).toBe(true);
    });

    it('should accept Date object as filter value', () => {
      const fn = getOperatorApplier(operators, 'is', new Date('2001-01-01'))!;
      expect(fn(new Date(2001, 0, 1), {})).toBe(true);
    });

    it('should return null for empty string', () => {
      expect(getOperatorApplier(operators, 'is', '')).toBe(null);
    });

    it('should return null for undefined', () => {
      expect(getOperatorApplier(operators, 'is', undefined)).toBe(null);
    });
  });
});

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

  describe('incomplete items skipped', () => {
    it('should skip incomplete items with AND and apply valid ones', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'li' },
          { field: 'name', operator: 'contains' }, // no value — incomplete
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      // Incomplete condition skipped, only 'contains li' applies
      expect(applier(rowIds)).toEqual([1, 3]); // Alice, Charlie
    });

    it('should skip incomplete items with OR and apply valid ones', () => {
      const model: FilterModel = {
        logicOperator: 'or',
        conditions: [
          { field: 'name', operator: 'equals', value: 'Bob' },
          { field: 'name', operator: 'contains' }, // no value — incomplete
        ],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow })!;
      expect(applier(rowIds)).toEqual([2]); // Bob only
    });
  });

  describe('ignoreDiacritics', () => {
    const diacriticsRows = [
      { id: 1, name: 'Apă' },
      { id: 2, name: 'Bob' },
    ];
    const diacriticsGetRow = (id: GridRowId) => diacriticsRows.find((r) => r.id === id)!;
    const diacriticsRowIds = diacriticsRows.map((r) => r.id);

    it('should not match diacritics by default', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'contains', value: 'apa' }],
      };
      const applier = buildFilterApplier({ model, getColumn, getRow: diacriticsGetRow })!;
      expect(applier(diacriticsRowIds)).toEqual([]);
    });

    it('should match when ignoreDiacritics is enabled', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'contains', value: 'apa' }],
      };
      const applier = buildFilterApplier({
        model,
        getColumn,
        getRow: diacriticsGetRow,
        ignoreDiacritics: true,
      })!;
      expect(applier(diacriticsRowIds)).toEqual([1]); // Apă matches apa
    });

    it('should match diacritics filter value against diacritics cell value', () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'name', operator: 'contains', value: 'apă' }],
      };
      const applier = buildFilterApplier({
        model,
        getColumn,
        getRow: diacriticsGetRow,
        ignoreDiacritics: true,
      })!;
      expect(applier(diacriticsRowIds)).toEqual([1]); // Apă matches apă
    });
  });
});

describe('cleanFilterModel', () => {
  it('should return same model when all fields are valid', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [
        { field: 'name', operator: 'contains', value: 'test' },
        { field: 'age', operator: '>', value: 25 },
      ],
    };
    const result = cleanFilterModel(model, () => true);
    expect(result).toBe(model); // Same reference
  });

  it('should remove conditions with invalid fields', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [
        { field: 'name', operator: 'contains', value: 'test' },
        { field: 'removed', operator: '>', value: 25 },
      ],
    };
    const validFields = new Set(['name']);
    const result = cleanFilterModel(model, (f) => validFields.has(f));
    expect(result.conditions).toHaveLength(1);
    expect((result.conditions[0] as FilterCondition).field).toBe('name');
  });

  it('should return empty conditions when all fields are invalid', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [{ field: 'removed', operator: 'contains', value: 'test' }],
    };
    const result = cleanFilterModel(model, () => false);
    expect(result.conditions).toHaveLength(0);
  });

  it('should clean nested groups recursively', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [
        { field: 'name', operator: 'contains', value: 'test' },
        {
          logicOperator: 'or',
          conditions: [
            { field: 'age', operator: '>', value: 25 },
            { field: 'removed', operator: '=', value: 10 },
          ],
        },
      ],
    };
    const validFields = new Set(['name', 'age']);
    const result = cleanFilterModel(model, (f) => validFields.has(f));
    expect(result.conditions).toHaveLength(2);
    const nestedGroup = result.conditions[1] as FilterGroup;
    expect(nestedGroup.conditions).toHaveLength(1);
    expect((nestedGroup.conditions[0] as FilterCondition).field).toBe('age');
  });

  it('should remove empty nested groups', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [
        { field: 'name', operator: 'contains', value: 'test' },
        {
          logicOperator: 'or',
          conditions: [{ field: 'removed', operator: '=', value: 10 }],
        },
      ],
    };
    const validFields = new Set(['name']);
    const result = cleanFilterModel(model, (f) => validFields.has(f));
    expect(result.conditions).toHaveLength(1);
    expect((result.conditions[0] as FilterCondition).field).toBe('name');
  });
});

describe('removeDiacritics', () => {
  it('should remove accents from characters', () => {
    expect(removeDiacritics('Apă')).toBe('Apa');
    expect(removeDiacritics('café')).toBe('cafe');
    expect(removeDiacritics('naïve')).toBe('naive');
    expect(removeDiacritics('résumé')).toBe('resume');
  });

  it('should not modify strings without diacritics', () => {
    expect(removeDiacritics('hello')).toBe('hello');
    expect(removeDiacritics('ABC123')).toBe('ABC123');
  });
});

describe('Quick Filter Functions', () => {
  describe('getStringQuickFilterFn', () => {
    it('should return a function for non-empty value', () => {
      const fn = getStringQuickFilterFn('test')!;
      expect(fn).toBeDefined();
      expect(fn('testing', {})).toBe(true);
      expect(fn('hello', {})).toBe(false);
    });

    it('should return null for empty value', () => {
      expect(getStringQuickFilterFn('')).toBe(null);
      expect(getStringQuickFilterFn(null)).toBe(null);
      expect(getStringQuickFilterFn(undefined)).toBe(null);
    });

    it('should be case insensitive', () => {
      const fn = getStringQuickFilterFn('TEST')!;
      expect(fn('testing', {})).toBe(true);
    });

    it('should return false for null cell values', () => {
      const fn = getStringQuickFilterFn('test')!;
      expect(fn(null, {})).toBe(false);
    });
  });

  describe('getNumericQuickFilterFn', () => {
    it('should return a function for valid numeric value', () => {
      const fn = getNumericQuickFilterFn(25)!;
      expect(fn).toBeDefined();
      expect(fn(25, {})).toBe(true);
      expect(fn(30, {})).toBe(false);
    });

    it('should return null for non-numeric values', () => {
      expect(getNumericQuickFilterFn('')).toBe(null);
      expect(getNumericQuickFilterFn(null)).toBe(null);
      expect(getNumericQuickFilterFn('abc')).toBe(null);
    });
  });

  describe('getSingleSelectQuickFilterFn', () => {
    it('should match against string representation', () => {
      const fn = getSingleSelectQuickFilterFn('cat')!;
      expect(fn).toBeDefined();
      expect(fn('cat', {})).toBe(true);
      expect(fn('category', {})).toBe(true); // contains
      expect(fn('dog', {})).toBe(false);
    });

    it('should return null for empty value', () => {
      expect(getSingleSelectQuickFilterFn('')).toBe(null);
      expect(getSingleSelectQuickFilterFn(null)).toBe(null);
    });

    it('should be case insensitive', () => {
      const fn = getSingleSelectQuickFilterFn('CAT')!;
      expect(fn('cat', {})).toBe(true);
    });
  });
});

describe('Quick Filter (buildFilterApplier)', () => {
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
  const getAllColumnFields = () => ['name', 'age'];
  const getVisibleColumnFields = () => ['name', 'age'];

  it('should filter by single quick filter value across string columns', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [],
      quickFilter: { values: ['li'] },
    };
    const applier = buildFilterApplier({
      model,
      getColumn,
      getRow,
      getAllColumnFields,
      getVisibleColumnFields,
    })!;
    // Alice and Charlie contain 'li'
    expect(applier(rowIds)).toEqual([1, 3]);
  });

  it('should filter by multiple quick filter values with AND logic', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [],
      quickFilter: { values: ['li', 'Bob'], logicOperator: 'and' },
    };
    const applier = buildFilterApplier({
      model,
      getColumn,
      getRow,
      getAllColumnFields,
      getVisibleColumnFields,
    })!;
    // 'li' matches Alice and Charlie. 'Bob' matches Bob only.
    // AND means row must match ALL values, so no row matches both.
    expect(applier(rowIds)).toEqual([]);
  });

  it('should filter by multiple quick filter values with OR logic', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [],
      quickFilter: { values: ['Alice', 'Bob'], logicOperator: 'or' },
    };
    const applier = buildFilterApplier({
      model,
      getColumn,
      getRow,
      getAllColumnFields,
      getVisibleColumnFields,
    })!;
    // Alice matches 'Alice', Bob matches 'Bob'
    expect(applier(rowIds)).toEqual([1, 2]);
  });

  it('should combine quick filter with regular filter conditions', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [{ field: 'age', operator: '>', value: 25 }],
      quickFilter: { values: ['li'] },
    };
    const applier = buildFilterApplier({
      model,
      getColumn,
      getRow,
      getAllColumnFields,
      getVisibleColumnFields,
    })!;
    // 'li' matches Alice(25) and Charlie(35). age > 25 filters out Alice.
    expect(applier(rowIds)).toEqual([3]);
  });

  it('should respect quickFilterExcludeHiddenColumns', () => {
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [],
      quickFilter: { values: ['25'], excludeHiddenColumns: false },
    };
    const getAllFields = () => ['name', 'age'];
    const getVisibleFields = () => ['name']; // age is hidden

    const applier = buildFilterApplier({
      model,
      getColumn,
      getRow,
      getAllColumnFields: getAllFields,
      getVisibleColumnFields: getVisibleFields,
    })!;
    // quickFilterExcludeHiddenColumns=false => search ALL columns including hidden 'age'
    // 25 matches age column for Alice and Diana
    expect(applier(rowIds)).toEqual([1, 4]);
  });

  it('should return null when no quick filter columns have quick filter fn', () => {
    const columnWithoutQuickFilter: Record<string, any> = {
      name: {
        field: 'name',
        filterOperators: [{ value: 'contains', getApplyFilterFn: () => null }],
      },
    };
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [],
      quickFilter: { values: ['test'] },
    };
    const applier = buildFilterApplier({
      model,
      getColumn: (f) => columnWithoutQuickFilter[f],
      getRow,
      getAllColumnFields: () => ['name'],
      getVisibleColumnFields: () => ['name'],
    });
    expect(applier).toBe(null);
  });
});

describe('valueParser', () => {
  const rows = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
  ];

  const stringOperators = getStringFilterOperators();
  const numericOperators = getNumericFilterOperators();

  const getRow = (id: GridRowId) => rows.find((r) => r.id === id)!;
  const rowIds = rows.map((r) => r.id);

  it('should apply valueParser to condition value before filtering', () => {
    const columnLookup: Record<string, any> = {
      age: {
        field: 'age',
        filterOperators: numericOperators,
        valueParser: (value: any) => Number(value) * 2,
      },
    };
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [{ field: 'age', operator: '=', value: 15 }],
    };
    // valueParser(15) = 30, so it should match Bob (age 30)
    const applier = buildFilterApplier({
      model,
      getColumn: (f) => columnLookup[f],
      getRow,
    })!;
    expect(applier(rowIds)).toEqual([2]);
  });

  it('should apply valueParser to array values (isAnyOf)', () => {
    const columnLookup: Record<string, any> = {
      name: {
        field: 'name',
        filterOperators: stringOperators,
        valueParser: (value: any) => String(value).toUpperCase(),
      },
    };
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [{ field: 'name', operator: 'isAnyOf', value: ['alice', 'bob'] }],
    };
    // valueParser maps each to uppercase: ['ALICE', 'BOB']
    const applier = buildFilterApplier({
      model,
      getColumn: (f) => columnLookup[f],
      getRow,
    })!;
    // isAnyOf uses collator with sensitivity: 'base', so ALICE matches Alice
    expect(applier(rowIds)).toEqual([1, 2]);
  });

  it('should not modify value when no valueParser', () => {
    const columnLookup: Record<string, any> = {
      name: { field: 'name', filterOperators: stringOperators },
    };
    const model: FilterModel = {
      logicOperator: 'and',
      conditions: [{ field: 'name', operator: 'contains', value: 'Ali' }],
    };
    const applier = buildFilterApplier({
      model,
      getColumn: (f) => columnLookup[f],
      getRow,
    })!;
    expect(applier(rowIds)).toEqual([1]);
  });
});

describe('dateTime seconds handling', () => {
  const dateTimeOperators = getDateFilterOperators(true);

  it('after should consider seconds when showTime is true', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'after', '2001-01-01T07:30:00')!;
    // 7:30:30 > 7:30:00 (raw comparison, seconds matter)
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
    expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(false);
  });

  it('before should consider seconds', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'before', '2001-01-01T07:30:30')!;
    // 7:30:00 < 7:30:30 (raw comparison)
    expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(true);
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(false);
  });

  it('onOrAfter should consider seconds when showTime is true', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'onOrAfter', '2001-01-01T07:30:30')!;
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
    expect(fn(new Date(2001, 0, 1, 7, 30, 29), {})).toBe(false);
  });

  it('onOrBefore should consider seconds when showTime is true', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'onOrBefore', '2001-01-01T07:30:30')!;
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
    expect(fn(new Date(2001, 0, 1, 7, 30, 31), {})).toBe(false);
  });

  it('is should still zero seconds for equality', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'is', '2001-01-01T07:30')!;
    // Both zeroed to 7:30:00
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(true);
    expect(fn(new Date(2001, 0, 1, 7, 30, 0), {})).toBe(true);
  });

  it('not should still zero seconds for equality', () => {
    const fn = getOperatorApplier(dateTimeOperators, 'not', '2001-01-01T07:30')!;
    // Both zeroed to 7:30:00
    expect(fn(new Date(2001, 0, 1, 7, 30, 30), {})).toBe(false);
    expect(fn(new Date(2001, 0, 1, 7, 31, 0), {})).toBe(true);
  });
});

describe('dateTime default operators', () => {
  it('should return showTime operators for dateTime type', () => {
    const operators = getDefaultFilterOperators('dateTime');
    const afterOp = operators.find((op) => op.value === 'after')!;
    // With showTime=true and keepRawComparison, seconds should matter for 'after'
    const fn = afterOp.getApplyFilterFn({
      field: 'test',
      operator: 'after',
      value: '2001-01-01T07:30:00',
    })!;
    // 7:30:30 > 7:30:00 should be true with showTime
    expect(fn(new Date(2001, 0, 1, 7, 30, 30) as any, {})).toBe(true);
  });
});

describe('Numeric edge cases', () => {
  const operators = getNumericFilterOperators();

  it('= 0 should match empty string (Number("") === 0)', () => {
    const fn = getOperatorApplier(operators, '=', 0)!;
    expect(fn('', {})).toBe(true);
  });

  it('= 0 should not match null', () => {
    const fn = getOperatorApplier(operators, '=', 0)!;
    expect(fn(null, {})).toBe(false);
  });

  it('= 0 should not match undefined', () => {
    const fn = getOperatorApplier(operators, '=', 0)!;
    expect(fn(undefined, {})).toBe(false);
  });

  it('!= 0 should not match empty string', () => {
    const fn = getOperatorApplier(operators, '!=', 0)!;
    expect(fn('', {})).toBe(false);
  });

  it('!= 0 should match null (null !== 0)', () => {
    const fn = getOperatorApplier(operators, '!=', 0)!;
    expect(fn(null, {})).toBe(true);
  });
});

describe('getValueAsString', () => {
  it('singleSelect "is" operator should have getValueAsString', () => {
    const operators = getSingleSelectFilterOperators();
    const isOp = operators.find((op) => op.value === 'is')!;
    expect(isOp.getValueAsString).toBeDefined();
    expect(isOp.getValueAsString!('cat')).toBe('cat');
    expect(isOp.getValueAsString!(null)).toBe('');
    expect(isOp.getValueAsString!(undefined)).toBe('');
  });

  it('singleSelect "not" operator should have getValueAsString', () => {
    const operators = getSingleSelectFilterOperators();
    const notOp = operators.find((op) => op.value === 'not')!;
    expect(notOp.getValueAsString).toBeDefined();
    expect(notOp.getValueAsString!('dog')).toBe('dog');
  });
});
