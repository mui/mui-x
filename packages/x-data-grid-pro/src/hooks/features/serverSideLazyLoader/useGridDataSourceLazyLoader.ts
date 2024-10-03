import * as React from 'react';
import { throttle } from '@mui/x-internals/throttle';
import {
  useGridApiEventHandler,
  useGridSelector,
  gridSortModelSelector,
  gridFilterModelSelector,
  GridEventListener,
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridSkeletonRowNode,
  gridPaginationModelSelector,
  gridDimensionsSelector,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridGetRowsParams,
  gridRenderContextSelector,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection } from '../lazyLoader/utils';
import { GRID_SKELETON_ROW_ROOT_ID } from '../lazyLoader/useGridLazyLoaderPreProcessors';

enum LoadingTrigger {
  VIEWPORT,
  SCROLL_END,
}

const INTERVAL_CACHE_INITIAL_STATE = {
  firstRowToRender: 0,
  lastRowToRender: 0,
};

const getSkeletonRowId = (index: number) => `${GRID_SKELETON_ROW_ROOT_ID}-${index}`;

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
    | 'pagination'
    | 'paginationMode'
    | 'unstable_dataSource'
    | 'lazyLoading'
    | 'lazyLoadingRequestThrottleMs'
    | 'scrollEndThreshold'
  >,
): void => {
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const paginationModel = useGridSelector(privateApiRef, gridPaginationModelSelector);
  const dimensions = useGridSelector(privateApiRef, gridDimensionsSelector);
  const renderContext = useGridSelector(privateApiRef, gridRenderContextSelector);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const previousLastRowIndex = React.useRef(0);
  const loadingTrigger = React.useRef<LoadingTrigger | null>(null);
  const isDisabled = !props.unstable_dataSource || props.lazyLoading !== true;

  const heights = React.useMemo(
    () => ({
      viewport: dimensions.viewportInnerSize.height,
      content: dimensions.contentSize.height,
    }),
    [dimensions.viewportInnerSize.height, dimensions.contentSize.height],
  );

  // Adjust the render context range to fit the pagination model's page size
  // First row index should be decreased to the start of the page, end row index should be increased to the end of the page
  const adjustRowParams = React.useCallback(
    (params: GridGetRowsParams) => {
      if (typeof params.start !== 'number') {
        return params;
      }

      return {
        ...params,
        start: params.start - (params.start % paginationModel.pageSize),
        end: params.end + paginationModel.pageSize - (params.end % paginationModel.pageSize) - 1,
      };
    },
    [paginationModel],
  );

  const resetGrid = React.useCallback(() => {
    privateApiRef.current.setRows([]);
    privateApiRef.current.setLoading(true);
    privateApiRef.current.unstable_dataSource.cache.clear();
    previousLastRowIndex.current = 0;
    const getRowsParams: GridGetRowsParams = {
      start: 0,
      end: paginationModel.pageSize - 1,
      sortModel,
      filterModel,
    };

    privateApiRef.current.publishEvent('getRows', getRowsParams);
  }, [privateApiRef, sortModel, filterModel, paginationModel.pageSize]);

  const ensureValidRowCount = React.useCallback(
    (previousLoadingTrigger: LoadingTrigger, newLoadingTrigger: LoadingTrigger) => {
      // switching from lazy loading to infinite loading should always reset the grid
      // since there is no guarantee that the new data will be placed correctly
      // there might be some skeleton rows in between the data or the data has changed (row count became unknown)
      if (
        previousLoadingTrigger === LoadingTrigger.VIEWPORT &&
        newLoadingTrigger === LoadingTrigger.SCROLL_END
      ) {
        resetGrid();
        return;
      }

      // switching from infinite loading to lazy loading should reset the grid only if the known row count
      // is smaller than the amount of rows rendered
      const tree = privateApiRef.current.state.rows.tree;
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const rootGroupChildren = [...rootGroup.children];

      const pageRowCount = privateApiRef.current.state.pagination.rowCount;
      const rootChildrenCount = rootGroupChildren.length;

      if (rootChildrenCount > pageRowCount) {
        resetGrid();
      }
    },
    [privateApiRef, resetGrid],
  );

  const adjustGridRows = React.useCallback(() => {
    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rootChildrenCount = rootGroupChildren.length;

    // if row count cannot be determined or all rows are there, do nothing
    if (pageRowCount === -1 || rootChildrenCount === 0 || rootChildrenCount === pageRowCount) {
      return;
    }

    // fill the grid with skeleton rows
    for (let i = 0; i < pageRowCount - rootChildrenCount; i += 1) {
      const skeletonId = getSkeletonRowId(i);

      rootGroupChildren.push(skeletonId);

      const skeletonRowNode: GridSkeletonRowNode = {
        type: 'skeletonRow',
        id: skeletonId,
        parent: GRID_ROOT_GROUP_ID,
        depth: 0,
      };

      tree[skeletonId] = skeletonRowNode;
    }

    tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };

    privateApiRef.current.setState(
      (state) => ({
        ...state,
        rows: {
          ...state.rows,
          tree,
        },
      }),
      'addSkeletonRows',
    );
  }, [privateApiRef]);

  const updateLoadingTrigger = React.useCallback(
    (rowCount: number) => {
      const newLoadingTrigger =
        rowCount === -1 ? LoadingTrigger.SCROLL_END : LoadingTrigger.VIEWPORT;

      if (loadingTrigger.current !== newLoadingTrigger) {
        loadingTrigger.current = newLoadingTrigger;
      }

      if (loadingTrigger.current !== null) {
        ensureValidRowCount(loadingTrigger.current, newLoadingTrigger);
      }
    },
    [ensureValidRowCount],
  );

  const handleDataUpdate = React.useCallback(() => {
    if (isDisabled) {
      return;
    }

    if (loadingTrigger.current === null) {
      updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
    }

    adjustGridRows();
    privateApiRef.current.state.rows.loading = false;
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, isDisabled, updateLoadingTrigger, adjustGridRows]);

  const handleRowCountChange = React.useCallback(() => {
    if (isDisabled || loadingTrigger.current === null) {
      return;
    }

    updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
    adjustGridRows();
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, isDisabled, updateLoadingTrigger, adjustGridRows]);

  const handleScrolling: GridEventListener<'scrollPositionChange'> = React.useCallback(
    (newScrollPosition) => {
      if (
        isDisabled ||
        loadingTrigger.current !== LoadingTrigger.SCROLL_END ||
        previousLastRowIndex.current >= renderContext.lastRowIndex
      ) {
        return;
      }

      const position = newScrollPosition.top + heights.viewport;
      const target = heights.content - props.scrollEndThreshold;

      if (position >= target) {
        previousLastRowIndex.current = renderContext.lastRowIndex;

        const getRowsParams: GridGetRowsParams = {
          start: renderContext.lastRowIndex,
          end: renderContext.lastRowIndex + paginationModel.pageSize - 1,
          sortModel,
          filterModel,
        };

        privateApiRef.current.setLoading(true);
        privateApiRef.current.publishEvent('getRows', adjustRowParams(getRowsParams));
      }
    },
    [
      privateApiRef,
      props.scrollEndThreshold,
      isDisabled,
      sortModel,
      filterModel,
      heights,
      paginationModel.pageSize,
      renderContext.lastRowIndex,
      adjustRowParams,
    ],
  );

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (isDisabled || loadingTrigger.current !== LoadingTrigger.VIEWPORT) {
        return;
      }

      const getRowsParams: GridGetRowsParams = {
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

      getRowsParams.start = skeletonRowsSection.firstRowIndex;
      getRowsParams.end = skeletonRowsSection.lastRowIndex;

      privateApiRef.current.publishEvent('getRows', adjustRowParams(getRowsParams));
    },
    [
      privateApiRef,
      isDisabled,
      props.pagination,
      props.paginationMode,
      sortModel,
      filterModel,
      adjustRowParams,
    ],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, props.lazyLoadingRequestThrottleMs),
    [props.lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      previousLastRowIndex.current = 0;
      if (loadingTrigger.current === LoadingTrigger.VIEWPORT) {
        // replace all rows with skeletons to maintain the same scroll position
        adjustGridRows();
      }

      const rangeParams =
        loadingTrigger.current === LoadingTrigger.VIEWPORT
          ? {
              start: renderContext.firstRowIndex,
              end: renderContext.lastRowIndex,
            }
          : {
              start: 0,
              end: paginationModel.pageSize - 1,
            };

      const getRowsParams: GridGetRowsParams = {
        ...rangeParams,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.publishEvent('getRows', adjustRowParams(getRowsParams));
    },
    [
      privateApiRef,
      isDisabled,
      filterModel,
      paginationModel.pageSize,
      renderContext,
      adjustGridRows,
      adjustRowParams,
    ],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      previousLastRowIndex.current = 0;
      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.publishEvent('getRows', getRowsParams);
    },
    [privateApiRef, isDisabled, sortModel, paginationModel.pageSize],
  );

  useGridApiEventHandler(privateApiRef, 'rowsFetched', handleDataUpdate);
  useGridApiEventHandler(privateApiRef, 'rowCountChange', handleRowCountChange);
  useGridApiEventHandler(privateApiRef, 'scrollPositionChange', handleScrolling);
  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    throttledHandleRenderedRowsIntervalChange,
  );
  useGridApiEventHandler(privateApiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
};
