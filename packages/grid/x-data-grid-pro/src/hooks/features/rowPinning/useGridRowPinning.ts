import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridStateInitializer } from '@mui/x-data-grid/internals';

import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridRowPinningApi } from './gridRowPinningInterface';

export const rowPinningStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>
> = (state, props, apiRef) => {
  apiRef.current.unstable_caches.pinnedRows = {
    top: [],
    bottom: [],
  };

  return {
    ...state,
    rows: {
      ...state.rows,
      additionalRowGroups: {
        ...state.rows?.additionalRowGroups,
        pinnedRows: { top: [], bottom: [] },
      },
    },
  };
};

export const useGridRowPinning = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId' | 'experimentalFeatures'>,
): void => {
  const isRowPinned = React.useCallback<GridRowPinningApi['unstable_isRowPinned']>(
    (rowId) => {
      return apiRef.current.getRowNode(rowId)?.isPinned || false;
    },
    [apiRef],
  );

  const setPinnedRows = React.useCallback<GridRowPinningApi['unstable_setPinnedRows']>(
    (newPinnedRows) => {
      if (!props.experimentalFeatures?.rowPinning) {
        return;
      }
      apiRef.current.unstable_caches.pinnedRows = {
        top: newPinnedRows.top || [],
        bottom: newPinnedRows.bottom || [],
      };

      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');
    },
    [apiRef, props.experimentalFeatures?.rowPinning],
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
