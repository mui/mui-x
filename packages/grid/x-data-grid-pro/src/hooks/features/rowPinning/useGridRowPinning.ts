import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridStateInitializer } from '@mui/x-data-grid/internals';

import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridRowPinningApi } from './gridRowPinningInterface';

export const rowPinningStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId' | 'experimentalFeatures'>
> = (state, props, apiRef) => {
  if (!props.experimentalFeatures?.rowPinning) {
    return state;
  }

  apiRef.current.unstable_caches.pinnedRows = {
    top: props.pinnedRows?.top || [],
    bottom: props.pinnedRows?.bottom || [],
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
      unstable_setPinnedRows: setPinnedRows,
    },
    'rowPinningApi',
  );

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.pinnedRows) {
      apiRef.current.unstable_setPinnedRows(props.pinnedRows);
    }
  }, [apiRef, props.pinnedRows]);
};
