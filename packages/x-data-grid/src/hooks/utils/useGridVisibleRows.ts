import type { RefObject } from '@mui/x-internals/types';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import {
  gridPaginationSelector,
  gridVisibleRowsSelector,
} from '../features/pagination/gridPaginationSelector';
import { gridExpandedSortedRowEntriesSelector } from '../features/filter/gridFilterSelector';
import type { GridApiCommon, GridRowId } from '../../models';
import { useGridSelector } from '.';

export const getVisibleRows = <Api extends GridApiCommon>(
  apiRef: RefObject<Api>,
  // TODO: remove after getVisibleRows implementations have been updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props?: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode'>,
) => {
  return gridVisibleRowsSelector(apiRef);
};

/**
 * Computes the list of rows that are reachable by scroll.
 * Depending on whether pagination is enabled, it will return the rows in the current page.
 * - If the pagination is disabled or in server mode, it equals all the visible rows.
 * - If the row tree has several layers, it contains up to `state.pageSize` top level rows and all their descendants.
 * - If the row tree is flat, it only contains up to `state.pageSize` rows.
 */

export const useGridVisibleRows = <Api extends GridApiCommon>(
  apiRef: RefObject<Api>,
  // TODO: remove after useGridVisibleRows implementations have been updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props?: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode'>,
) => {
  return useGridSelector(apiRef, gridVisibleRowsSelector);
};

/**
 * Returns the row index expected by `apiRef.current.scrollToIndexes`. For server-side
 * pagination, the current page offset is added to the index of the loaded row.
 * Returns `undefined` when the row is not part of the visible rows.
 */
export const getRowIndexRelativeToAllRows = <Api extends GridApiCommon>(
  apiRef: RefObject<Api>,
  id: GridRowId,
) => {
  const rowIndex = gridExpandedSortedRowEntriesSelector(apiRef).findIndex((row) => row.id === id);

  if (rowIndex === -1) {
    return undefined;
  }

  const pagination = gridPaginationSelector(apiRef);
  if (!pagination.enabled || pagination.paginationMode === 'client') {
    return rowIndex;
  }

  return pagination.paginationModel.page * pagination.paginationModel.pageSize + rowIndex;
};
