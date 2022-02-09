import { useGridPageSize } from './useGridPageSize';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridPage } from './useGridPage';

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: GridApiRef,
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
