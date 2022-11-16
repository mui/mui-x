import * as React from 'react';
import { useGridPageSize, defaultPageSize, MAX_PAGE_SIZE } from './useGridPageSize';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridPage, getPageCount } from './useGridPage';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridSignature } from '../../utils';

export const paginationStateInitializer: GridStateInitializer<
  Pick<
    DataGridProcessedProps,
    'page' | 'pageSize' | 'rowCount' | 'initialState' | 'autoPageSize' | 'signature'
  >
> = (state, props) => {
  let pageSize: number;
  if (props.pageSize != null) {
    pageSize = props.pageSize;
  } else if (props.initialState?.pagination?.pageSize != null) {
    pageSize = props.initialState.pagination.pageSize;
    if (props.signature === GridSignature.DataGrid && pageSize > MAX_PAGE_SIZE) {
      throw new Error(
        [
          'MUI: `pageSize` cannot exceed 100 in the MIT version of the DataGrid.',
          'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
        ].join('\n'),
      );
    }
  } else {
    pageSize = defaultPageSize(props.autoPageSize);
  }

  return {
    ...state,
    pagination: {
      pageSize,
      page: props.page ?? props.initialState?.pagination?.page ?? 0,
      pageCount: getPageCount(props.rowCount ?? 0, pageSize),
      rowCount: props.rowCount ?? 0,
    },
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'page'
    | 'pageSize'
    | 'onPageChange'
    | 'onPageSizeChange'
    | 'autoPageSize'
    | 'rowCount'
    | 'initialState'
    | 'paginationMode'
  >,
) => {
  useGridPageSize(apiRef, props);
  useGridPage(apiRef, props);
};
