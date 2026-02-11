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

export const selectStartRow = createSelector((state: PaginationState) => {
  const { model, rowCount } = state.pagination;
  if (rowCount === 0) {
    return 0;
  }
  return model.page * model.pageSize + 1;
});

export const selectEndRow = createSelector((state: PaginationState) => {
  const { model, paginatedRowIds, rowCount } = state.pagination;
  if (rowCount === 0) {
    return 0;
  }
  const start = model.page * model.pageSize + 1;
  return Math.min(start + paginatedRowIds.length - 1, rowCount);
});

export const paginationSelectors: PaginationSelectors = {
  model: selectPaginationModel,
  paginatedRowIds: selectPaginatedRowIds,
  pageCount: selectPageCount,
  rowCount: selectRowCount,
  startRow: selectStartRow,
  endRow: selectEndRow,
};
