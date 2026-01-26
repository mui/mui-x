import { describe, it, expect } from 'vitest';
import {
  gridStringOrNumberComparator,
  gridNumberComparator,
  gridDateComparator,
  getNextGridSortDirection,
  buildSortingApplier,
  applySortingToRowIds,
  upsertSortModel,
} from './utils';
import {
  selectSortModel,
  selectSortedRowIds,
  selectSortColumnLookup,
  selectIsSorted,
} from './selectors';
import type { GridSortDirection, GridSortModel, SortingState } from './types';

describe('Sorting Plugin', () => {
  describe('utils', () => {
    describe('getNextGridSortDirection', () => {
      it('should return the first direction when current is undefined', () => {
        const sortingOrder: GridSortDirection[] = ['asc', 'desc', null];
        expect(getNextGridSortDirection(sortingOrder, undefined)).toBe('asc');
      });

      it('should return the first direction when current is null and null is last', () => {
        const sortingOrder: GridSortDirection[] = ['asc', 'desc', null];
        expect(getNextGridSortDirection(sortingOrder, null)).toBe('asc');
      });

      it('should cycle through directions correctly', () => {
        const sortingOrder: GridSortDirection[] = ['asc', 'desc', null];
        expect(getNextGridSortDirection(sortingOrder, 'asc')).toBe('desc');
        expect(getNextGridSortDirection(sortingOrder, 'desc')).toBe(null);
        expect(getNextGridSortDirection(sortingOrder, null)).toBe('asc');
      });

      it('should handle custom sorting order', () => {
        const sortingOrder: GridSortDirection[] = ['desc', 'asc'];
        expect(getNextGridSortDirection(sortingOrder, undefined)).toBe('desc');
        expect(getNextGridSortDirection(sortingOrder, 'desc')).toBe('asc');
        expect(getNextGridSortDirection(sortingOrder, 'asc')).toBe('desc');
      });

      it('should handle single direction order', () => {
        const sortingOrder: GridSortDirection[] = ['asc'];
        expect(getNextGridSortDirection(sortingOrder, undefined)).toBe('asc');
        expect(getNextGridSortDirection(sortingOrder, 'asc')).toBe('asc');
      });

      it('should handle asc and null only', () => {
        const sortingOrder: GridSortDirection[] = ['asc', null];
        expect(getNextGridSortDirection(sortingOrder, undefined)).toBe('asc');
        expect(getNextGridSortDirection(sortingOrder, 'asc')).toBe(null);
        expect(getNextGridSortDirection(sortingOrder, null)).toBe('asc');
      });
    });

    describe('gridStringOrNumberComparator', () => {
      it('should sort strings correctly', () => {
        const params = { id: 1, field: 'test', value: '', row: {} };
        expect(gridStringOrNumberComparator('apple', 'banana', params, params)).toBeLessThan(0);
        expect(gridStringOrNumberComparator('banana', 'apple', params, params)).toBeGreaterThan(0);
        expect(gridStringOrNumberComparator('apple', 'apple', params, params)).toBe(0);
      });

      it('should sort numbers correctly', () => {
        const params = { id: 1, field: 'test', value: 0, row: {} };
        expect(gridStringOrNumberComparator(1, 2, params, params)).toBeLessThan(0);
        expect(gridStringOrNumberComparator(2, 1, params, params)).toBeGreaterThan(0);
        expect(gridStringOrNumberComparator(1, 1, params, params)).toBe(0);
      });

      it('should handle null values (nulls first)', () => {
        const params = { id: 1, field: 'test', value: null, row: {} };
        expect(gridStringOrNumberComparator(null, 'apple', params, params)).toBe(-1);
        expect(gridStringOrNumberComparator('apple', null, params, params)).toBe(1);
        expect(gridStringOrNumberComparator(null, null, params, params)).toBe(0);
      });

      it('should handle undefined values', () => {
        const params = { id: 1, field: 'test', value: undefined, row: {} };
        expect(gridStringOrNumberComparator(undefined, 'apple', params, params)).toBe(-1);
        expect(gridStringOrNumberComparator('apple', undefined, params, params)).toBe(1);
        expect(gridStringOrNumberComparator(undefined, undefined, params, params)).toBe(0);
      });
    });

    describe('gridNumberComparator', () => {
      it('should sort numbers correctly', () => {
        const params = { id: 1, field: 'test', value: 0, row: {} };
        expect(gridNumberComparator(1, 2, params, params)).toBeLessThan(0);
        expect(gridNumberComparator(2, 1, params, params)).toBeGreaterThan(0);
        expect(gridNumberComparator(5, 5, params, params)).toBe(0);
      });

      it('should handle negative numbers', () => {
        const params = { id: 1, field: 'test', value: 0, row: {} };
        expect(gridNumberComparator(-1, 1, params, params)).toBeLessThan(0);
        expect(gridNumberComparator(1, -1, params, params)).toBeGreaterThan(0);
      });

      it('should handle null values', () => {
        const params = { id: 1, field: 'test', value: null, row: {} };
        expect(gridNumberComparator(null, 5, params, params)).toBe(-1);
        expect(gridNumberComparator(5, null, params, params)).toBe(1);
      });
    });

    describe('gridDateComparator', () => {
      it('should sort dates correctly', () => {
        const params = { id: 1, field: 'test', value: null, row: {} };
        const date1 = new Date('2020-01-01');
        const date2 = new Date('2021-01-01');

        expect(gridDateComparator(date1, date2, params, params)).toBeLessThan(0);
        expect(gridDateComparator(date2, date1, params, params)).toBeGreaterThan(0);
        expect(gridDateComparator(date1, date1, params, params)).toBe(0);
      });

      it('should handle null values', () => {
        const params = { id: 1, field: 'test', value: null, row: {} };
        const date = new Date('2020-01-01');

        expect(gridDateComparator(null, date, params, params)).toBe(-1);
        expect(gridDateComparator(date, null, params, params)).toBe(1);
      });
    });
  });

  describe('selectors', () => {
    const createState = (overrides: Partial<SortingState['sorting']> = {}): SortingState => ({
      sorting: {
        sortModel: [],
        sortedRowIds: [],
        ...overrides,
      },
    });

    describe('selectSortModel', () => {
      it('should return the current sort model', () => {
        const state = createState({ sortModel: [{ field: 'name', sort: 'asc' }] });
        expect(selectSortModel(state)).toEqual([{ field: 'name', sort: 'asc' }]);
      });

      it('should return empty array when no sorting', () => {
        const state = createState();
        expect(selectSortModel(state)).toEqual([]);
      });
    });

    describe('selectSortedRowIds', () => {
      it('should return sorted row IDs', () => {
        const state = createState({ sortedRowIds: [3, 1, 2] });
        expect(selectSortedRowIds(state)).toEqual([3, 1, 2]);
      });
    });

    describe('selectSortColumnLookup', () => {
      it('should return empty object when no sorting', () => {
        const state = createState();
        expect(selectSortColumnLookup(state)).toEqual({});
      });

      it('should return lookup for single column', () => {
        const state = createState({ sortModel: [{ field: 'name', sort: 'asc' }] });
        expect(selectSortColumnLookup(state)).toEqual({
          name: { sortDirection: 'asc', sortIndex: 0 },
        });
      });

      it('should return lookup for multiple columns', () => {
        const state = createState({
          sortModel: [
            { field: 'name', sort: 'asc' },
            { field: 'age', sort: 'desc' },
          ],
        });
        expect(selectSortColumnLookup(state)).toEqual({
          name: { sortDirection: 'asc', sortIndex: 0 },
          age: { sortDirection: 'desc', sortIndex: 1 },
        });
      });
    });

    describe('selectIsSorted', () => {
      it('should return false when no sorting', () => {
        const state = createState();
        expect(selectIsSorted(state)).toBe(false);
      });

      it('should return true when sorted', () => {
        const state = createState({ sortModel: [{ field: 'name', sort: 'asc' }] });
        expect(selectIsSorted(state)).toBe(true);
      });

      it('should return false when sortModel has null direction', () => {
        const state = createState({ sortModel: [{ field: 'name', sort: null }] });
        expect(selectIsSorted(state)).toBe(false);
      });
    });
  });

  describe('upsertSortModel', () => {
    it('should add a new sort item to empty model', () => {
      const result = upsertSortModel([], 'name', { field: 'name', sort: 'asc' });
      expect(result).toEqual([{ field: 'name', sort: 'asc' }]);
    });

    it('should update existing sort item', () => {
      const model: GridSortModel = [{ field: 'name', sort: 'asc' }];
      const result = upsertSortModel(model, 'name', { field: 'name', sort: 'desc' });
      expect(result).toEqual([{ field: 'name', sort: 'desc' }]);
    });

    it('should remove sort item when newItem is undefined', () => {
      const model: GridSortModel = [
        { field: 'name', sort: 'asc' },
        { field: 'age', sort: 'desc' },
      ];
      const result = upsertSortModel(model, 'name', undefined);
      expect(result).toEqual([{ field: 'age', sort: 'desc' }]);
    });

    it('should add new item while preserving existing items (multi-sort)', () => {
      const model: GridSortModel = [{ field: 'name', sort: 'asc' }];
      const result = upsertSortModel(model, 'age', { field: 'age', sort: 'desc' });
      expect(result).toEqual([
        { field: 'name', sort: 'asc' },
        { field: 'age', sort: 'desc' },
      ]);
    });
  });

  describe('buildSortingApplier', () => {
    const rows = [
      { id: 1, name: 'Charlie', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
      { id: 3, name: 'Bob', age: 35 },
    ];

    const getRow = (id: number | string) => rows.find((r) => r.id === id);
    const getColumn = (field: string) => ({ field, id: field });

    it('should return null when sortModel is empty', () => {
      const applier = buildSortingApplier({
        sortModel: [],
        getColumn,
        getRow,
      });
      expect(applier).toBeNull();
    });

    it('should return null when sortModel has only null directions', () => {
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: null }],
        getColumn,
        getRow,
      });
      expect(applier).toBeNull();
    });

    it('should sort by single column ascending', () => {
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn,
        getRow,
      });
      expect(applier).not.toBeNull();
      const sorted = applier!([1, 2, 3]);
      expect(sorted).toEqual([2, 3, 1]); // Alice, Bob, Charlie
    });

    it('should sort by single column descending', () => {
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'desc' }],
        getColumn,
        getRow,
      });
      const sorted = applier!([1, 2, 3]);
      expect(sorted).toEqual([1, 3, 2]); // Charlie, Bob, Alice
    });

    it('should sort by multiple columns', () => {
      const rowsWithDuplicates = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
      ];
      const getRowMulti = (id: number | string) => rowsWithDuplicates.find((r) => r.id === id);

      const applier = buildSortingApplier({
        sortModel: [
          { field: 'name', sort: 'asc' },
          { field: 'age', sort: 'asc' },
        ],
        getColumn,
        getRow: getRowMulti,
      });
      const sorted = applier!([1, 2, 3]);
      // Alice (25), Alice (30), Bob (35)
      expect(sorted).toEqual([2, 1, 3]);
    });

    it('should use custom sortComparator from column', () => {
      const getColumnWithComparator = (field: string) => ({
        field,
        id: field,
        // Reverse string comparator
        sortComparator: (a: string, b: string) => b.localeCompare(a),
      });

      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: getColumnWithComparator,
        getRow,
      });
      const sorted = applier!([1, 2, 3]);
      // With reversed comparator: Charlie, Bob, Alice
      expect(sorted).toEqual([1, 3, 2]);
    });

    it('should use sortComparator factory function', () => {
      const getColumnWithFactory = (field: string) => ({
        field,
        id: field,
        // Factory that returns different comparators based on direction
        sortComparator: (direction: GridSortDirection) => {
          if (direction === 'asc') {
            return (a: string, b: string) => a.localeCompare(b);
          }
          if (direction === 'desc') {
            return (a: string, b: string) => b.localeCompare(a);
          }
          return undefined;
        },
      });

      const applierAsc = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: getColumnWithFactory,
        getRow,
      });
      expect(applierAsc!([1, 2, 3])).toEqual([2, 3, 1]); // Alice, Bob, Charlie

      const applierDesc = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'desc' }],
        getColumn: getColumnWithFactory,
        getRow,
      });
      expect(applierDesc!([1, 2, 3])).toEqual([1, 3, 2]); // Charlie, Bob, Alice
    });

    it('should use sortValueGetter from column', () => {
      const getColumnWithValueGetter = (field: string) => ({
        field,
        id: field,
        // Sort by name length instead of name
        sortValueGetter: (row: (typeof rows)[0]) => row.name.length,
      });

      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: getColumnWithValueGetter,
        getRow,
      });
      const sorted = applier!([1, 2, 3]);
      // Bob (3), Alice (5), Charlie (7)
      expect(sorted).toEqual([3, 2, 1]);
    });
  });

  describe('applySortingToRowIds', () => {
    const rows = [
      { id: 1, name: 'Charlie', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
      { id: 3, name: 'Bob', age: 35 },
    ];

    const getRow = (id: number | string) => rows.find((r) => r.id === id);
    const getColumn = (field: string) => ({ field, id: field });

    it('should return original order when applier is null', () => {
      const result = applySortingToRowIds([1, 2, 3], null, false, []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should apply sorting without stableSort', () => {
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn,
        getRow,
      });
      const result = applySortingToRowIds([1, 2, 3], applier, false, []);
      expect(result).toEqual([2, 3, 1]); // Alice, Bob, Charlie
    });

    it('should apply stableSort - preserving previous order within equal groups', () => {
      // Rows where some have same age
      const rowsWithSameAge = [
        { id: 1, name: 'Charlie', age: 30 },
        { id: 2, name: 'Alice', age: 30 },
        { id: 3, name: 'Bob', age: 25 },
      ];
      const getRowStable = (id: number | string) => rowsWithSameAge.find((r) => r.id === id);

      // First sort by name
      const nameApplier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn,
        getRow: getRowStable,
      });
      const sortedByName = applySortingToRowIds([1, 2, 3], nameApplier, false, []);
      expect(sortedByName).toEqual([2, 3, 1]); // Alice, Bob, Charlie

      // Then sort by age with stableSort - within same age, previous order preserved
      const ageApplier = buildSortingApplier({
        sortModel: [{ field: 'age', sort: 'asc' }],
        getColumn,
        getRow: getRowStable,
      });
      const sortedByAge = applySortingToRowIds([1, 2, 3], ageApplier, true, sortedByName);
      // Age 25: Bob, Age 30: Alice, Charlie (preserved from name sort)
      expect(sortedByAge).toEqual([3, 2, 1]);
    });
  });

  describe('sortingOrder configuration', () => {
    it('should cycle through custom sortingOrder', () => {
      const order: GridSortDirection[] = ['desc', 'asc', null];
      expect(getNextGridSortDirection(order, undefined)).toBe('desc');
      expect(getNextGridSortDirection(order, 'desc')).toBe('asc');
      expect(getNextGridSortDirection(order, 'asc')).toBe(null);
      expect(getNextGridSortDirection(order, null)).toBe('desc');
    });

    it('should handle sortingOrder without null (no reset)', () => {
      const order: GridSortDirection[] = ['asc', 'desc'];
      expect(getNextGridSortDirection(order, undefined)).toBe('asc');
      expect(getNextGridSortDirection(order, 'asc')).toBe('desc');
      expect(getNextGridSortDirection(order, 'desc')).toBe('asc'); // cycles back
    });

    it('should handle single direction sortingOrder', () => {
      const order: GridSortDirection[] = ['asc'];
      expect(getNextGridSortDirection(order, undefined)).toBe('asc');
      expect(getNextGridSortDirection(order, 'asc')).toBe('asc'); // stays at asc
    });
  });

  describe('multi-column sorting', () => {
    const rows = [
      { id: 1, firstName: 'Alice', lastName: 'Smith', age: 30 },
      { id: 2, firstName: 'Bob', lastName: 'Smith', age: 25 },
      { id: 3, firstName: 'Charlie', lastName: 'Jones', age: 30 },
      { id: 4, firstName: 'Alice', lastName: 'Jones', age: 35 },
    ];

    const getRow = (id: number | string) => rows.find((r) => r.id === id);
    const getColumn = (field: string) => ({ field, id: field });

    it('should sort by primary then secondary column', () => {
      const applier = buildSortingApplier({
        sortModel: [
          { field: 'lastName', sort: 'asc' },
          { field: 'firstName', sort: 'asc' },
        ],
        getColumn,
        getRow,
      });
      const sorted = applier!([1, 2, 3, 4]);
      // Jones: Alice, Charlie; Smith: Alice, Bob
      expect(sorted).toEqual([4, 3, 1, 2]);
    });

    it('should sort by three columns', () => {
      const applier = buildSortingApplier({
        sortModel: [
          { field: 'lastName', sort: 'asc' },
          { field: 'age', sort: 'desc' },
          { field: 'firstName', sort: 'asc' },
        ],
        getColumn,
        getRow,
      });
      const sorted = applier!([1, 2, 3, 4]);
      // Jones (35: Alice, 30: Charlie), Smith (30: Alice, 25: Bob)
      expect(sorted).toEqual([4, 3, 1, 2]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty row array', () => {
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: () => ({ field: 'name', id: 'name' }),
        getRow: () => undefined,
      });
      const sorted = applier!([] as number[]);
      expect(sorted).toEqual([]);
    });

    it('should handle single row', () => {
      const row = { id: 1, name: 'Alice' };
      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: () => ({ field: 'name', id: 'name' }),
        getRow: () => row,
      });
      const sorted = applier!([1]);
      expect(sorted).toEqual([1]);
    });

    it('should handle null values in data', () => {
      const rows = [
        { id: 1, name: 'Charlie' },
        { id: 2, name: null },
        { id: 3, name: 'Alice' },
      ];
      const getRow = (id: number | string) => rows.find((r) => r.id === id);

      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: () => ({ field: 'name', id: 'name' }),
        getRow,
      });
      const sorted = applier!([1, 2, 3]);
      // null first, then Alice, Charlie
      expect(sorted).toEqual([2, 3, 1]);
    });

    it('should handle undefined values in data', () => {
      const rows = [
        { id: 1, name: 'Charlie' },
        { id: 2 }, // name is undefined
        { id: 3, name: 'Alice' },
      ];
      const getRow = (id: number | string) => rows.find((r) => r.id === id);

      const applier = buildSortingApplier({
        sortModel: [{ field: 'name', sort: 'asc' }],
        getColumn: () => ({ field: 'name', id: 'name' }),
        getRow,
      });
      const sorted = applier!([1, 2, 3]);
      // undefined first, then Alice, Charlie
      expect(sorted).toEqual([2, 3, 1]);
    });

    it('should skip non-existent column gracefully', () => {
      const rows = [
        { id: 1, name: 'Charlie' },
        { id: 2, name: 'Alice' },
      ];
      const getRow = (id: number | string) => rows.find((r) => r.id === id);

      const applier = buildSortingApplier({
        sortModel: [{ field: 'nonexistent', sort: 'asc' }],
        getColumn: () => undefined, // column not found
        getRow,
      });
      // Should return null since no valid sort items
      expect(applier).toBeNull();
    });
  });
});
