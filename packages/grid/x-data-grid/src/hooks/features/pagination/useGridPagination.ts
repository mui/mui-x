import * as React from 'react';
import { useGridPageSize } from './useGridPageSize';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridPage } from './useGridPage';

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'page'
    | 'pageSize'
    | 'onPageChange'
    | 'onPageSizeChange'
    | 'autoPageSize'
    | 'rowCount'
    | 'initialState'
  >,
) => {
  useGridPageSize(apiRef, props);
  useGridPage(apiRef, props);
};
