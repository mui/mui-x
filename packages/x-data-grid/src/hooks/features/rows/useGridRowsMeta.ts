'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridRowsMetaApi, GridRowsMetaPrivateApi } from '../../../models/api/gridRowsMetaApi';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { gridRowCountSelector, gridRowTreeSelector } from './gridRowsSelector';
import { gridRowHeightSelector } from '../dimensions/gridDimensionsSelectors';

export const rowsMetaStateInitializer: GridStateInitializer = (state, props, apiRef) => {
  // FIXME: This should be handled in the virtualizer eventually, but there are interdependencies
  // between state initializers that need to be untangled carefully.

  const baseRowHeight = gridRowHeightSelector(apiRef);
  const dataRowCount = gridRowCountSelector(apiRef);
  const pagination = gridPaginationSelector(apiRef);
  const rowCount = Math.min(
    pagination.enabled ? pagination.paginationModel.pageSize : dataRowCount,
    dataRowCount,
  );

  return {
    ...state,
    rowsMeta: {
      currentPageTotalHeight: rowCount * baseRowHeight,
      positions: Array.from({ length: rowCount }, (_, i) => i * baseRowHeight),
      pinnedTopTotalHeight: 0,
      pinnedBottomTotalHeight: 0,
    },
  };
};

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsMeta = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  _props: Pick<
    DataGridProcessedProps,
    | 'getRowHeight'
    | 'getEstimatedRowHeight'
    | 'getRowSpacing'
    | 'pagination'
    | 'paginationMode'
    | 'rowHeight'
  >,
): void => {
  const virtualizer = apiRef.current.virtualizer;

  const {
    getRowHeight,
    setLastMeasuredRowIndex,
    storeRowHeightMeasurement,
    resetRowHeights,
    hydrateRowsMeta,
    observeRowHeight,
    rowHasAutoHeight,
    getRowHeightEntry,
    getLastMeasuredRowIndex,
  } = virtualizer.api.rowsMeta;

  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);

  const rowsMetaApi: GridRowsMetaApi = {
    unstable_getRowHeight: getRowHeight,
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_storeRowHeightMeasurement: storeRowHeightMeasurement,
    resetRowHeights,
  };

  const rowsMetaPrivateApi: GridRowsMetaPrivateApi = {
    hydrateRowsMeta,
    observeRowHeight,
    rowHasAutoHeight,
    getRowHeightEntry,
    getLastMeasuredRowIndex,
  };

  useGridApiMethod(apiRef, rowsMetaApi, 'public');
  useGridApiMethod(apiRef, rowsMetaPrivateApi, 'private');

  // The virtualizer caches the heights by row id and only knows the rows of the current page,
  // so it cannot tell when a row is gone. Without this, the cache keeps an entry for every row id it has ever seen.
  const rowTree = useGridSelector(apiRef, gridRowTreeSelector);
  React.useEffect(() => {
    const { rowHeights } = apiRef.current.virtualizer.store.state;
    for (const rowId of rowHeights.keys()) {
      if (!rowTree[rowId]) {
        rowHeights.delete(rowId);
      }
    }
  }, [apiRef, rowTree]);
};
