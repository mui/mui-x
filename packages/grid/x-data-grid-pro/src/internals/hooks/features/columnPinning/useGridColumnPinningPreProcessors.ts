import * as React from 'react';
import {
  Unstable_GridPreProcessor as GridPreProcessor,
  unstable_useGridRegisterPreProcessor as useGridRegisterPreProcessor,
} from '@mui/x-data-grid';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridPinnedColumnsSelector } from './gridColumnPinningSelector';
import { columnPinningStateInitializer } from './useGridColumnPinning';
import { GridApiPro } from '../../../models/gridApiPro';
import { filterColumns } from '../../../components/DataGridProVirtualScroller';

export const useGridColumnPinningPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: DataGridProProcessedProps,
) => {
  const { disableColumnPinning, pinnedColumns: pinnedColumnsProp, initialState } = props;

  let pinnedColumns = gridPinnedColumnsSelector(apiRef.current.state);
  if (pinnedColumns == null) {
    // Since the state is not ready yet lets use the initializer to get which
    // columns should be pinned initially.
    const initializedState = columnPinningStateInitializer(
      apiRef.current.state,
      { disableColumnPinning, pinnedColumns: pinnedColumnsProp, initialState },
      apiRef,
    ) as GridApiPro['state'];
    pinnedColumns = gridPinnedColumnsSelector(initializedState);
  }

  const reorderPinnedColumns = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (columnsState.all.length === 0 || disableColumnPinning) {
        return columnsState;
      }

      const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
        pinnedColumns,
        columnsState.all,
      );

      if (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0) {
        return columnsState;
      }

      const centerColumns = columnsState.all.filter((field) => {
        return !leftPinnedColumns.includes(field) && !rightPinnedColumns.includes(field);
      });

      return {
        ...columnsState,
        all: [...leftPinnedColumns, ...centerColumns, ...rightPinnedColumns],
      };
    },
    [disableColumnPinning, pinnedColumns],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', reorderPinnedColumns);
};
