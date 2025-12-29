'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useGridApiMethod } from '@mui/x-data-grid';
import { getRowIdFromRowModel, GridStateInitializer } from '@mui/x-data-grid/internals';

import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps, DataGridProProps } from '../../../models/dataGridProProps';
import {
  GridPinnedRowsProp,
  GridRowPinningApi,
  GridRowPinningInternalCache,
} from './gridRowPinningInterface';

function createPinnedRowsInternalCache(
  pinnedRows: GridPinnedRowsProp | undefined,
  getRowId: DataGridProProps['getRowId'],
) {
  const cache: GridRowPinningInternalCache = {
    topIds: [],
    bottomIds: [],
    idLookup: {},
  };

  pinnedRows?.top?.forEach((rowModel) => {
    const id = getRowIdFromRowModel(rowModel, getRowId);
    cache.topIds.push(id);
    cache.idLookup[id] = rowModel;
  });

  pinnedRows?.bottom?.forEach((rowModel) => {
    const id = getRowIdFromRowModel(rowModel, getRowId);
    cache.bottomIds.push(id);
    cache.idLookup[id] = rowModel;
  });

  return cache;
}

export const rowPinningStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>
> = (state, { pinnedRows: pinnedRowsProp, getRowId }, apiRef) => {
  apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(pinnedRowsProp, getRowId);

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
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'pinnedRows' | 'getRowId'>,
): void => {
  const { pinnedRows, getRowId } = props;
  const setPinnedRows = React.useCallback<GridRowPinningApi['unstable_setPinnedRows']>(
    (newPinnedRows) => {
      apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(newPinnedRows, getRowId);

      apiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [apiRef, getRowId],
  );

  useGridApiMethod(
    apiRef,
    {
      unstable_setPinnedRows: setPinnedRows,
    },
    'public',
  );

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.unstable_setPinnedRows(pinnedRows);
  }, [apiRef, pinnedRows]);
};
