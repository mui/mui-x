import { describe, it, expect } from 'vitest';
import {
  getPageCount,
  getValidPage,
  paginateRowIds,
  getDefaultPaginationModel,
} from './paginationUtils';
import {
  selectPaginationModel,
  selectPaginatedRowIds,
  selectPageCount,
  selectRowCount,
} from './selectors';
import type { PaginationState } from './types';

describe('Pagination Plugin', () => {
  describe('utils', () => {
    describe('getDefaultPaginationModel', () => {
      it('should return page 0 and pageSize 10', () => {
        expect(getDefaultPaginationModel()).toEqual({ page: 0, pageSize: 10 });
      });
    });

    describe('getPageCount', () => {
      it('should calculate page count for evenly divisible rows', () => {
        expect(getPageCount(100, 10, 0)).toBe(10);
      });

      it('should round up for partial last page', () => {
        expect(getPageCount(25, 10, 0)).toBe(3);
      });

      it('should return page + 2 for unknown rowCount (-1)', () => {
        expect(getPageCount(-1, 10, 0)).toBe(2);
        expect(getPageCount(-1, 10, 2)).toBe(4);
        expect(getPageCount(-1, 10, 5)).toBe(7);
      });

      it('should return 0 for zero rows', () => {
        expect(getPageCount(0, 10, 0)).toBe(0);
      });

      it('should return 0 for zero pageSize', () => {
        expect(getPageCount(100, 0, 0)).toBe(0);
      });

      it('should return 0 for negative pageSize', () => {
        expect(getPageCount(100, -5, 0)).toBe(0);
      });

      it('should return 1 for single row', () => {
        expect(getPageCount(1, 10, 0)).toBe(1);
      });

      it('should handle pageSize of 1', () => {
        expect(getPageCount(5, 1, 0)).toBe(5);
      });

      it('should return 1 for Infinity pageSize', () => {
        expect(getPageCount(100, Infinity, 0)).toBe(1);
        expect(getPageCount(1, Infinity, 0)).toBe(1);
      });

      it('should return 0 for Infinity pageSize with zero rows', () => {
        expect(getPageCount(0, Infinity, 0)).toBe(0);
      });
    });

    describe('getValidPage', () => {
      it('should return page within valid range', () => {
        expect(getValidPage(2, 5)).toBe(2);
      });

      it('should clamp page to last page when exceeding range', () => {
        expect(getValidPage(10, 5)).toBe(4);
      });

      it('should clamp negative page to 0', () => {
        expect(getValidPage(-1, 5)).toBe(0);
      });

      it('should return 0 when pageCount is 0', () => {
        expect(getValidPage(0, 0)).toBe(0);
        expect(getValidPage(3, 0)).toBe(0);
      });

      it('should return 0 for first page', () => {
        expect(getValidPage(0, 10)).toBe(0);
      });

      it('should return last valid page index', () => {
        expect(getValidPage(9, 10)).toBe(9);
      });
    });

    describe('paginateRowIds', () => {
      const allRowIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      it('should return first page', () => {
        expect(paginateRowIds(allRowIds, { page: 0, pageSize: 5 })).toEqual([1, 2, 3, 4, 5]);
      });

      it('should return middle page', () => {
        expect(paginateRowIds(allRowIds, { page: 1, pageSize: 5 })).toEqual([6, 7, 8, 9, 10]);
      });

      it('should return last page (partial)', () => {
        expect(paginateRowIds(allRowIds, { page: 2, pageSize: 5 })).toEqual([11, 12, 13, 14, 15]);
      });

      it('should return empty array for page beyond last', () => {
        expect(paginateRowIds(allRowIds, { page: 5, pageSize: 5 })).toEqual([]);
      });

      it('should return empty array for empty input', () => {
        expect(paginateRowIds([], { page: 0, pageSize: 10 })).toEqual([]);
      });

      it('should return empty array when pageSize is 0', () => {
        expect(paginateRowIds(allRowIds, { page: 0, pageSize: 0 })).toEqual([]);
      });

      it('should return all rows when pageSize exceeds total', () => {
        expect(paginateRowIds([1, 2, 3], { page: 0, pageSize: 10 })).toEqual([1, 2, 3]);
      });

      it('should handle pageSize of 1', () => {
        expect(paginateRowIds(allRowIds, { page: 0, pageSize: 1 })).toEqual([1]);
        expect(paginateRowIds(allRowIds, { page: 1, pageSize: 1 })).toEqual([2]);
      });

      it('should handle string row IDs', () => {
        expect(paginateRowIds(['a', 'b', 'c', 'd'], { page: 1, pageSize: 2 })).toEqual(['c', 'd']);
      });

      it('should return all rows when pageSize is Infinity', () => {
        expect(paginateRowIds(allRowIds, { page: 0, pageSize: Infinity })).toEqual(allRowIds);
      });
    });
  });

  describe('selectors', () => {
    const createState = (
      overrides: Partial<PaginationState['pagination']> = {},
    ): PaginationState => ({
      pagination: {
        model: { page: 0, pageSize: 10 },
        rowCount: 0,
        pageCount: 0,
        paginatedRowIds: [],
        ...overrides,
      },
    });

    describe('selectPaginationModel', () => {
      it('should return the current pagination model', () => {
        const state = createState({ model: { page: 2, pageSize: 25 } });
        expect(selectPaginationModel(state)).toEqual({ page: 2, pageSize: 25 });
      });
    });

    describe('selectPaginatedRowIds', () => {
      it('should return paginated row IDs', () => {
        const state = createState({ paginatedRowIds: [5, 6, 7] });
        expect(selectPaginatedRowIds(state)).toEqual([5, 6, 7]);
      });
    });

    describe('selectPageCount', () => {
      it('should return the page count', () => {
        const state = createState({ pageCount: 5 });
        expect(selectPageCount(state)).toBe(5);
      });
    });

    describe('selectRowCount', () => {
      it('should return the row count', () => {
        const state = createState({ rowCount: 100 });
        expect(selectRowCount(state)).toBe(100);
      });
    });
  });
});
