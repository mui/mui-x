import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import {
  GridStateInitializer,
  GridHydrateRowsValue,
  GridPinnedRowsState,
  getRowIdFromRowModel,
} from '@mui/x-data-grid/internals';

import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridRowPinningApi } from './gridRowPinningInterface';

function getPinnedRowsStateFromProp({
  pinnedRows,
  getRowId,
}: Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>) {
  return {
    top: (pinnedRows?.top || []).map((row) => ({
      id: getRowIdFromRowModel(row, getRowId),
      model: row,
    })),
    bottom: (pinnedRows?.bottom || []).map((row) => ({
      id: getRowIdFromRowModel(row, getRowId),
      model: row,
    })),
  };
}

export const rowPinningStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>
> = (state, props) => {
  let model: GridPinnedRowsState;
  if (props.pinnedRows) {
    model = getPinnedRowsStateFromProp({ pinnedRows: props.pinnedRows, getRowId: props.getRowId });
  } else {
    model = { top: [], bottom: [] };
  }

  return {
    ...state,
    rows: {
      ...state.rows,
      additionalRowGroups: {
        ...state.rows?.additionalRowGroups,
        pinnedRows: model,
      },
    },
  };
};

export const mergeRowsStateWithPinnedRows = <R extends GridHydrateRowsValue = GridHydrateRowsValue>(
  rowsState: R,
  pinnedRows: GridPinnedRowsState,
): R => ({
  ...rowsState,
  additionalRowGroups: {
    ...rowsState.additionalRowGroups,
    pinnedRows,
  },
});

export const useGridRowPinning = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>,
): void => {
  const isRowPinned = React.useCallback<GridRowPinningApi['unstable_isRowPinned']>(
    (rowId) => {
      return apiRef.current.getRowNode(rowId)?.isPinned || false;
    },
    [apiRef],
  );

  const setPinnedRows = React.useCallback<GridRowPinningApi['unstable_setPinnedRows']>(
    (newPinnedRows) => {
      apiRef.current.setState((prevState) => {
        const newState = {
          ...prevState,
          rows: mergeRowsStateWithPinnedRows(
            prevState.rows,
            getPinnedRowsStateFromProp({
              pinnedRows: newPinnedRows,
              getRowId: props.getRowId,
            }),
          ),
        };
        return newState;
      });
      apiRef.current.forceUpdate();
    },
    [apiRef, props.getRowId],
  );

  useGridApiMethod(
    apiRef,
    {
      unstable_isRowPinned: isRowPinned,
      unstable_setPinnedRows: setPinnedRows,
    },
    'rowPinningApi',
  );

  React.useEffect(() => {
    if (props.pinnedRows) {
      apiRef.current.unstable_setPinnedRows(props.pinnedRows);
    }
  }, [apiRef, props.pinnedRows]);
};
