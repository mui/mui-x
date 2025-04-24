import { RefObject } from '@mui/x-internals/types';
import {
  useGridSelector,
  useGridEventPriority,
  gridVisibleColumnDefinitionsSelector,
  useGridEvent,
  GridEventListener,
} from '@mui/x-data-grid';
import { useGridVisibleRows, runIf } from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'pagination' | 'paginationMode' | 'rowsLoadingMode'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);

  const isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;

  const handleLoadMoreRows: GridEventListener<'rowsScrollEndIntersection'> = useEventCallback(
    () => {
      const viewportPageSize = apiRef.current.getViewportPageSize();
      const rowScrollEndParams: GridRowScrollEndParams = {
        visibleColumns,
        viewportPageSize,
        visibleRowsCount: currentPage.rows.length,
      };
      apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
    },
  );

  useGridEventPriority(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
  useGridEvent(apiRef, 'rowsScrollEndIntersection', runIf(isEnabled, handleLoadMoreRows));
};
