import { clamp } from '@mui/x-internals/math';
import type { GridRowId } from '../internal/rows/types';
import type { PaginationModel } from './types';

export const DEFAULT_PAGINATION_MODEL: PaginationModel = { page: 0, pageSize: 10 };

/**
 * Calculate the total number of pages.
 * @param {number} rowCount The total number of rows. -1 means unknown.
 * @param {number} pageSize The number of rows per page.
 * @param {number} page The current page (used when rowCount is unknown).
 * @returns {number} The total number of pages.
 */
export function getPageCount(rowCount: number, pageSize: number, page: number): number {
  if (rowCount === 0 || pageSize <= 0) {
    return 0;
  }

  // Infinite pageSize means all rows fit on a single page
  if (!Number.isFinite(pageSize)) {
    return 1;
  }

  if (rowCount === -1) {
    // Unknown row count: assume at least one more page exists
    return page + 2;
  }

  return Math.ceil(rowCount / pageSize);
}

/**
 * Clamp a page number to the valid range [0, pageCount - 1].
 * @param {number} page The page to validate.
 * @param {number} pageCount The total number of pages.
 * @returns {number} A valid page number.
 */
export function getValidPage(page: number, pageCount: number): number {
  if (pageCount === 0) {
    return 0;
  }

  return clamp(page, 0, pageCount - 1);
}

/**
 * Slice row IDs for the current page.
 * @param {GridRowId[]} rowIds All row IDs to paginate.
 * @param {PaginationModel} model The pagination model.
 * @returns {GridRowId[]} The row IDs for the current page.
 */
export function paginateRowIds(rowIds: GridRowId[], model: PaginationModel): GridRowId[] {
  if (model.pageSize <= 0) {
    return [];
  }

  // Infinite pageSize means all rows on a single page
  if (!Number.isFinite(model.pageSize)) {
    return rowIds;
  }

  const start = model.page * model.pageSize;
  const end = start + model.pageSize;
  return rowIds.slice(start, end);
}
