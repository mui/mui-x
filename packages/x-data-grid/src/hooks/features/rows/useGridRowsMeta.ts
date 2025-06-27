import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ResizeObserver } from '../../../utils/ResizeObserver';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowsMetaApi, GridRowsMetaPrivateApi } from '../../../models/api/gridRowsMetaApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { eslintUseValue } from '../../../utils/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowEntry } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { gridPinnedRowsSelector, gridRowCountSelector } from './gridRowsSelector';
import {
  gridDimensionsSelector,
  gridRowHeightSelector,
} from '../dimensions/gridDimensionsSelectors';
import { getValidRowHeight, getRowHeightWarning } from './gridRowsUtils';
import type { HeightEntry } from './gridRowsMetaInterfaces';
import { gridFocusedVirtualCellSelector } from '../virtualization/gridFocusedVirtualCellSelector';
/* eslint-disable no-underscore-dangle */

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
      pinnedTopRowsTotalHeight: 0,
      pinnedBottomRowsTotalHeight: 0,
    },
  };
};

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsMeta = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<
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
  } = virtualizer.dimensions.rowsMeta;

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
};
