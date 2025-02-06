import { RefObject } from '@mui/x-internals/types';
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
    | 'pagination'
    | 'paginationMode'
  >
> = (state, props) => {
  const paginationModel = {
    ...getDefaultGridPaginationModel(props.autoPageSize),
    ...(props.paginationModel ?? props.initialState?.pagination?.paginationModel),
  };

  throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, props.signature);

  const rowCount =
    props.rowCount ??
    props.initialState?.pagination?.rowCount ??
    (props.paginationMode === 'client' ? state.rows?.totalRowCount : undefined);
  const meta = props.paginationMeta ?? props.initialState?.pagination?.meta ?? {};
  return {
    ...state,
    pagination: {
      ...state.pagination,
      paginationModel,
      rowCount,
      meta,
      enabled: props.pagination === true,
      paginationMode: props.paginationMode,
    },
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: DataGridProcessedProps,
) => {
  useGridPaginationMeta(apiRef, props);
  useGridPaginationModel(apiRef, props);
  useGridRowCount(apiRef, props);
};
