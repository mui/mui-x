import type { GridColDef, GridFilterItem } from '@mui/x-data-grid';
import { getGridMultiSelectOperators } from './gridMultiSelectOperators';

const operators = getGridMultiSelectOperators();
const containsOperator = operators.find((o) => o.value === 'contains')!;
const doesNotContainOperator = operators.find((o) => o.value === 'doesNotContain')!;
const isEmptyOperator = operators.find((o) => o.value === 'isEmpty')!;
const isNotEmptyOperator = operators.find((o) => o.value === 'isNotEmpty')!;

const column = { field: 'tags' } as GridColDef;
const row = {} as any;
const apiRef = { current: {} } as any;

const apply = (
  operator: typeof containsOperator,
  filterValue: GridFilterItem['value'],
  cellValue: any,
) => {
  const fn = operator.getApplyFilterFn(
    { field: 'tags', operator: operator.value, value: filterValue },
    column,
  );
  if (fn === null) {
    return null;
  }
  return fn(cellValue, row, column, apiRef);
};

describe('getGridMultiSelectOperators', () => {
  describe('contains', () => {
    it('returns null when filter value is not an array', () => {
      expect(
        containsOperator.getApplyFilterFn(
          { field: 'tags', operator: 'contains', value: undefined },
          column,
        ),
      ).to.equal(null);
    });

    it('returns null when filter value is an empty array', () => {
      expect(
        containsOperator.getApplyFilterFn(
          { field: 'tags', operator: 'contains', value: [] },
          column,
        ),
      ).to.equal(null);
    });

    it('matches with object-shaped filter values via parseObjectValue', () => {
      expect(apply(containsOperator, [{ value: 'A' }, { value: 'B' }], ['A', 'C'])).to.equal(true);
      expect(apply(containsOperator, [{ value: 'A' }, { value: 'B' }], ['C', 'D'])).to.equal(false);
    });

    it('matches null cell values when filtering by an option with value null', () => {
      expect(apply(containsOperator, [null], [null, 'A'])).to.equal(true);
      expect(apply(containsOperator, [{ value: null, label: 'None' }], [null, 'A'])).to.equal(true);
      expect(apply(containsOperator, [null], ['A', 'B'])).to.equal(false);
      expect(apply(containsOperator, [{ value: null, label: 'None' }], ['A', 'B'])).to.equal(false);
    });

    it('returns false when cell value is null', () => {
      expect(apply(containsOperator, ['A'], null)).to.equal(false);
    });

    it('returns false when cell value is undefined', () => {
      expect(apply(containsOperator, ['A'], undefined)).to.equal(false);
    });

    it('returns false when cell value is a non-array scalar', () => {
      expect(apply(containsOperator, ['A'], 'A')).to.equal(false);
    });

    it('uses OR semantics for multi-value filter', () => {
      expect(apply(containsOperator, ['A', 'B'], ['B'])).to.equal(true);
      expect(apply(containsOperator, ['A', 'B'], ['C'])).to.equal(false);
    });
  });

  describe('doesNotContain', () => {
    it('returns null when filter value is not an array', () => {
      expect(
        doesNotContainOperator.getApplyFilterFn(
          { field: 'tags', operator: 'doesNotContain', value: null },
          column,
        ),
      ).to.equal(null);
    });

    it('returns null when filter value is an empty array', () => {
      expect(
        doesNotContainOperator.getApplyFilterFn(
          { field: 'tags', operator: 'doesNotContain', value: [] },
          column,
        ),
      ).to.equal(null);
    });

    it('matches with object-shaped filter values via parseObjectValue', () => {
      expect(apply(doesNotContainOperator, [{ value: 'A' }], ['B', 'C'])).to.equal(true);
      expect(apply(doesNotContainOperator, [{ value: 'A' }], ['A', 'B'])).to.equal(false);
    });

    it('excludes null cell values when filtering by an option with value null', () => {
      expect(apply(doesNotContainOperator, [null], [null, 'A'])).to.equal(false);
      expect(apply(doesNotContainOperator, [{ value: null, label: 'None' }], [null, 'A'])).to.equal(
        false,
      );
      expect(apply(doesNotContainOperator, [null], ['A', 'B'])).to.equal(true);
      expect(apply(doesNotContainOperator, [{ value: null, label: 'None' }], ['A', 'B'])).to.equal(
        true,
      );
    });

    it('returns true when cell value is null (row included)', () => {
      expect(apply(doesNotContainOperator, ['A'], null)).to.equal(true);
    });

    it('returns true when cell value is undefined (row included)', () => {
      expect(apply(doesNotContainOperator, ['A'], undefined)).to.equal(true);
    });

    it('returns true when cell value is a non-array scalar (row included)', () => {
      expect(apply(doesNotContainOperator, ['A'], 'A')).to.equal(true);
    });

    it('excludes rows containing any of the filter values', () => {
      expect(apply(doesNotContainOperator, ['A', 'B'], ['B', 'C'])).to.equal(false);
      expect(apply(doesNotContainOperator, ['A', 'B'], ['C', 'D'])).to.equal(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true for null, undefined, scalar, and empty array', () => {
      expect(apply(isEmptyOperator, undefined, null)).to.equal(true);
      expect(apply(isEmptyOperator, undefined, undefined)).to.equal(true);
      expect(apply(isEmptyOperator, undefined, 'A')).to.equal(true);
      expect(apply(isEmptyOperator, undefined, [])).to.equal(true);
    });

    it('returns false for non-empty array', () => {
      expect(apply(isEmptyOperator, undefined, ['A'])).to.equal(false);
    });
  });

  describe('isNotEmpty', () => {
    it('returns true only for non-empty arrays', () => {
      expect(apply(isNotEmptyOperator, undefined, ['A'])).to.equal(true);
      expect(apply(isNotEmptyOperator, undefined, [])).to.equal(false);
      expect(apply(isNotEmptyOperator, undefined, null)).to.equal(false);
      expect(apply(isNotEmptyOperator, undefined, undefined)).to.equal(false);
      expect(apply(isNotEmptyOperator, undefined, 'A')).to.equal(false);
    });
  });
});
