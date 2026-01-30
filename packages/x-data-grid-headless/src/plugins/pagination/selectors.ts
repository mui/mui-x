import { createSelector } from '@base-ui/utils/store';
import type { PaginationSelectors, PaginationState } from './types';

export const selectPaginationModel = createSelector(
  (state: PaginationState) => state.pagination.model,
);

export const selectPaginatedRowIds = createSelector(
  (state: PaginationState) => state.pagination.paginatedRowIds,
);

export const selectPageCount = createSelector(
  (state: PaginationState) => state.pagination.pageCount,
);

export const selectRowCount = createSelector((state: PaginationState) => state.pagination.rowCount);

export const paginationSelectors: PaginationSelectors = {
  model: selectPaginationModel,
  paginatedRowIds: selectPaginatedRowIds,
  pageCount: selectPageCount,
  rowCount: selectRowCount,
};
