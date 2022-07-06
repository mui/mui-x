import * as React from 'react';
import {
  useGridApiEventHandler,
  GridFeatureModeConstant,
  GridRenderedRowsIntervalChangeParams,
  useGridSelector,
  GridRowId,
  gridVisibleSortedRowIdsSelector,
  gridSortModelSelector,
  gridFilterModelSelector,
  useGridApiOptionHandler,
  GridEventListener,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { getRenderableIndexes } from '@mui/x-data-grid/hooks/features/virtualization/useGridVirtualScroller';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_SKELETON_ROW_ROOT_ID } from './useGridLazyLoaderPreProcessors';
import { GridFetchRowsParams } from '../../../models/gridFetchRowsParams';

/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridLazyLoader = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onFetchRows' | 'rowsLoadingMode' | 'pagination' | 'paginationMode' | 'rowBuffer'
  >,
): void => {
  const visibleRows = useGridVisibleRows(apiRef, props);
  const rowIds = useGridSelector(apiRef, gridVisibleSortedRowIdsSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const renderedRowsIntervalCache = React.useRef<GridRenderedRowsIntervalChangeParams>({
    firstRowToRender: 0,
    lastRowToRender: 0,
  });

  const handleRenderedRowsIntervalChange = React.useCallback(
    (params: GridRenderedRowsIntervalChangeParams) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (
        !dimensions ||
        props.rowsLoadingMode !== GridFeatureModeConstant.server ||
        (renderedRowsIntervalCache.current.firstRowToRender === params.firstRowToRender &&
          renderedRowsIntervalCache.current.lastRowToRender === params.lastRowToRender)
      ) {
        return;
      }

      const renderedRowsIds: Array<GridRowId | null> = [...rowIds].splice(
        params.firstRowToRender,
        params.lastRowToRender - params.firstRowToRender,
      );
      const hasSkeletonRowIds = renderedRowsIds.some(
        (rowId) => `${rowId}`.indexOf(GRID_SKELETON_ROW_ROOT_ID) >= 0,
      );

      if (!hasSkeletonRowIds) {
        return;
      }

      renderedRowsIntervalCache.current = params;
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender: params.firstRowToRender,
        lastRowToRender: params.lastRowToRender,
        sortModel,
        filterModel,
      };
      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, rowIds, sortModel, filterModel],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (!dimensions || props.rowsLoadingMode !== GridFeatureModeConstant.server) {
        return;
      }

      const currentRenderContext = apiRef.current.unstable_getRenderContext();
      const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
        firstIndex: currentRenderContext.firstRowIndex,
        lastIndex: currentRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: visibleRows.rows.length,
        buffer: props.rowBuffer,
      });
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender,
        lastRowToRender,
        sortModel: newSortModel,
        filterModel,
      };

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, props.rowBuffer, visibleRows.rows, filterModel],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (!dimensions || props.rowsLoadingMode !== GridFeatureModeConstant.server) {
        return;
      }

      const currentRenderContext = apiRef.current.unstable_getRenderContext();
      const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
        firstIndex: currentRenderContext.firstRowIndex,
        lastIndex: currentRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: visibleRows.rows.length,
        buffer: props.rowBuffer,
      });
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender,
        lastRowToRender,
        sortModel,
        filterModel: newFilterModel,
      };

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, props.rowBuffer, visibleRows.rows, sortModel],
  );

  useGridApiEventHandler(apiRef, 'renderedRowsIntervalChange', handleRenderedRowsIntervalChange);
  useGridApiEventHandler(apiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(apiRef, 'filterModelChange', handleGridFilterModelChange);
  useGridApiOptionHandler(apiRef, 'fetchRows', props.onFetchRows);
};
