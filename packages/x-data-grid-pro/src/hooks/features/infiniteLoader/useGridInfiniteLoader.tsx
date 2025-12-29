import { RefObject } from '@mui/x-internals/types';
import {
  useGridEventPriority,
  gridVisibleColumnDefinitionsSelector,
  useGridEvent,
  GridEventListener,
} from '@mui/x-data-grid';
import { runIf, getVisibleRows } from '@mui/x-data-grid/internals';
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
  props: Pick<DataGridProProcessedProps, 'onRowsScrollEnd' | 'rowsLoadingMode'>,
): void => {
  const { onRowsScrollEnd, rowsLoadingMode } = props;
  const isEnabled = rowsLoadingMode === 'client' && !!onRowsScrollEnd;

  const handleLoadMoreRows: GridEventListener<'rowsScrollEndIntersection'> = useEventCallback(
    () => {
      const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
      const currentPage = getVisibleRows(apiRef);
      const viewportPageSize = apiRef.current.getViewportPageSize();
      const rowScrollEndParams: GridRowScrollEndParams = {
        visibleColumns,
        viewportPageSize,
        visibleRowsCount: currentPage.rows.length,
      };
      apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
    },
  );

  useGridEventPriority(apiRef, 'rowsScrollEnd', onRowsScrollEnd);
  useGridEvent(apiRef, 'rowsScrollEndIntersection', runIf(isEnabled, handleLoadMoreRows));
};
