import * as React from 'react';
import { GridComponentProps } from '../../GridComponentProps';
import {
  gridPaginationRowRangeSelector,
  gridPaginatedVisibleSortedGridRowEntriesSelector,
} from '../features/pagination/gridPaginationSelector';
import { gridVisibleSortedRowEntriesSelector } from '../features/filter/gridFilterSelector';
import type { GridApiRef, GridRowEntry } from '../../models';
import { useGridState } from './useGridState';

/**
 * Compute the list of the rows in the current page
 * - If the pagination is disabled or in server mode, it equals all the visible rows
 * - If the row tree has several layers, it contains up to `state.pageSize` top level rows and all their descendants
 * - If the row tree is flat, it only contains up to `state.pageSize` rows
 */
export const useRowsInCurrentPage = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination' | 'paginationMode'>,
) => {
  const [state] = useGridState(apiRef);

  let range: { firstRowIndex: number; lastRowIndex: number } | null;
  let rows: GridRowEntry[];

  if (props.pagination && props.paginationMode === 'client') {
    range = gridPaginationRowRangeSelector(state);
    rows = gridPaginatedVisibleSortedGridRowEntriesSelector(state);
  } else {
    rows = gridVisibleSortedRowEntriesSelector(state);
    if (rows.length === 0) {
      range = null;
    } else {
      range = { firstRowIndex: 0, lastRowIndex: rows.length - 1 };
    }
  }

  return React.useMemo(
    () => ({
      rows,
      range,
    }),
    [rows, range],
  );
};
