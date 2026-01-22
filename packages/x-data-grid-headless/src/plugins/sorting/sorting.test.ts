import { describe, it, expect } from 'vitest';
import {
  gridStringOrNumberComparator,
  gridNumberComparator,
  gridDateComparator,
  getNextGridSortDirection,
} from './utils';
import {
  selectSortModel,
  selectSortedRowIds,
  selectSortColumnLookup,
  selectIsSorted,
} from './selectors';
import type { GridSortDirection, SortingState } from './types';

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
});
