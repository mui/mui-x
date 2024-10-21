import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

import {
  throwIfPageSizeExceedsTheLimit,
  getDefaultGridPaginationModel,
} from './gridPaginationUtils';
import { useGridPaginationModel } from './useGridPaginationModel';
import { useGridRowCount } from './useGridRowCount';
import { useGridPaginationMeta } from './useGridPaginationMeta';

export const paginationStateInitializer: GridStateInitializer<
  Pick<
    DataGridProcessedProps,
    | 'paginationModel'
    | 'rowCount'
    | 'initialState'
    | 'autoPageSize'
    | 'signature'
    | 'paginationMeta'
  >
> = (state, props) => {
  const paginationModel = {
    ...getDefaultGridPaginationModel(props.autoPageSize),
    ...(props.paginationModel ?? props.initialState?.pagination?.paginationModel),
  };

  throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, props.signature);

  const rowCount = props.rowCount ?? props.initialState?.pagination?.rowCount;
  const meta = props.paginationMeta ?? props.initialState?.pagination?.meta ?? {};
  return {
    ...state,
    pagination: {
      paginationModel,
      rowCount,
      meta,
    },
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: DataGridProcessedProps,
) => {
  useGridPaginationMeta(apiRef, props);
  useGridPaginationModel(apiRef, props);
  useGridRowCount(apiRef, props);
};
