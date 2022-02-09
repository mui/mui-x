import * as React from 'react';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { filterColumns } from '../../../../../x-data-grid-pro/src/DataGridProVirtualScroller';
import { gridPinnedColumnsSelector } from './columnPinningSelector';
import { columnPinningStateInitializer } from './useGridColumnPinning';
import { GridState } from '../../../models/gridState';

export const useGridColumnPinningPreProcessors = (
  apiRef: GridApiRef,
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
    ) as GridState;
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
