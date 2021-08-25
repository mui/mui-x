import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { visibleSortedGridRowIdsSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';
import { gridContainerSizesSelector } from "../../root/gridContainerSizesSelector";

export const gridPaginationSelector = (state: GridState): GridPaginationState => state.pagination;

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector(
  gridPaginationSelector,
  visibleSortedGridRowIdsSelector,
    gridContainerSizesSelector,
    (pagination, visibleSortedRows, containerSizes) => {
      if (!containerSizes) {
          return []
      }

    const firstSelectedRowIndex = pagination.page * pagination.pageSize;
    const lastSelectedRowIndex = firstSelectedRowIndex + containerSizes.virtualRowsCount;

    return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
  },
);
