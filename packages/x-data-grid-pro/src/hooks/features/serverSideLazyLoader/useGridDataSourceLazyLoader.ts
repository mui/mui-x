import * as React from 'react';
import {
  useGridApiEventHandler,
  useGridSelector,
  gridSortModelSelector,
  gridFilterModelSelector,
  GridEventListener,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridGetRowsParams,
  gridRenderContextSelector,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection } from '../lazyLoader/utils';

const INTERVAL_CACHE_INITIAL_STATE = {
  firstRowToRender: 0,
  lastRowToRender: 0,
};

/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridDataSourceLazyLoader = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'pagination' | 'paginationMode' | 'unstable_dataSource' | 'lazyLoading'
  >,
): void => {
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const isDisabled = !props.unstable_dataSource || props.lazyLoading !== true;

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (isDisabled) {
        return;
      }

      const fetchRowsParams: GridGetRowsParams = {
        start: params.firstRowIndex,
        end: params.lastRowIndex,
        sortModel,
        filterModel,
      };

      if (
        renderedRowsIntervalCache.current.firstRowToRender === params.firstRowIndex &&
        renderedRowsIntervalCache.current.lastRowToRender === params.lastRowIndex
      ) {
        return;
      }

      renderedRowsIntervalCache.current = {
        firstRowToRender: params.firstRowIndex,
        lastRowToRender: params.lastRowIndex,
      };

      if (sortModel.length === 0 && filterModel.items.length === 0) {
        const currentVisibleRows = getVisibleRows(privateApiRef, {
          pagination: props.pagination,
          paginationMode: props.paginationMode,
        });
        const skeletonRowsSection = findSkeletonRowsSection({
          apiRef: privateApiRef,
          visibleRows: currentVisibleRows.rows,
          range: {
            firstRowIndex: params.firstRowIndex,
            lastRowIndex: params.lastRowIndex,
          },
        });

        if (!skeletonRowsSection) {
          return;
        }

        fetchRowsParams.start = skeletonRowsSection.firstRowIndex;
        fetchRowsParams.end = skeletonRowsSection.lastRowIndex;
      }

      privateApiRef.current.publishEvent('getRows', fetchRowsParams);
    },
    [privateApiRef, isDisabled, props.pagination, props.paginationMode, sortModel, filterModel],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      renderedRowsIntervalCache.current = INTERVAL_CACHE_INITIAL_STATE;

      const renderContext = gridRenderContextSelector(privateApiRef);
      const fetchRowsParams: GridGetRowsParams = {
        start: renderContext.firstRowIndex,
        end: renderContext.lastRowIndex,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.publishEvent('getRows', fetchRowsParams);
    },
    [privateApiRef, isDisabled, filterModel],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      renderedRowsIntervalCache.current = INTERVAL_CACHE_INITIAL_STATE;

      const renderContext = gridRenderContextSelector(privateApiRef);
      const fetchRowsParams: GridGetRowsParams = {
        start: renderContext.firstRowIndex,
        end: renderContext.lastRowIndex,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.publishEvent('getRows', fetchRowsParams);
    },
    [privateApiRef, isDisabled, sortModel],
  );

  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    handleRenderedRowsIntervalChange,
  );
  // TODO: if sorting/filtering happens firther away from the top, sometimes one skeleton row is left
  useGridApiEventHandler(privateApiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
};
