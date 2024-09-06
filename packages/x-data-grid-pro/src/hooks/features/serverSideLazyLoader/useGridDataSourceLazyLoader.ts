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
    'pagination' | 'paginationMode' | 'unstable_dataSource' | 'lazyLoading' | 'scrollEndThreshold'
  >,
): void => {
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const paginationModel = useGridSelector(privateApiRef, gridPaginationModelSelector);
  const dimensions = useGridSelector(privateApiRef, gridDimensionsSelector);
  const renderContext = useGridSelector(privateApiRef, gridRenderContextSelector);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const previousLastRowIndex = React.useRef(0);
  const isDisabled = !props.unstable_dataSource || props.lazyLoading !== true;
  const [loadingMode, setLoadingMode] = React.useState<LoadingTrigger | null>(null);

  const heights = React.useMemo(
    () => ({
      viewport: dimensions.viewportInnerSize.height,
      content: dimensions.contentSize.height,
    }),
    [dimensions.viewportInnerSize.height, dimensions.contentSize.height],
  );

  const addSkeletonRows = React.useCallback(() => {
    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rowCount = privateApiRef.current.getRowsCount();

    if (pageRowCount === undefined || rowCount >= pageRowCount) {
      return;
    }

    for (let i = 0; i < pageRowCount - rowCount; i += 1) {
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

  const handleScrolling: GridEventListener<'scrollPositionChange'> = React.useCallback(
    (newScrollPosition) => {
      if (
        isDisabled ||
        loadingMode !== LoadingTrigger.SCROLL_END ||
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
        privateApiRef.current.publishEvent('getRows', getRowsParams);
      }
    },
    [
      privateApiRef,
      props.scrollEndThreshold,
      isDisabled,
      loadingMode,
      sortModel,
      filterModel,
      heights,
      paginationModel.pageSize,
      renderContext.lastRowIndex,
    ],
  );

  const handleDataUpdate = React.useCallback(() => {
    if (isDisabled) {
      return;
    }

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const newLoadingMode =
      pageRowCount === undefined || pageRowCount === -1
        ? LoadingTrigger.SCROLL_END
        : LoadingTrigger.VIEWPORT;
    if (loadingMode !== newLoadingMode) {
      setLoadingMode(newLoadingMode);
    }

    addSkeletonRows();
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, isDisabled, loadingMode, addSkeletonRows]);

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (isDisabled) {
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

      privateApiRef.current.publishEvent('getRows', getRowsParams);
    },
    [privateApiRef, isDisabled, props.pagination, props.paginationMode, sortModel, filterModel],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, 500), // TODO: make it configurable
    [handleRenderedRowsIntervalChange],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      previousLastRowIndex.current = 0;
      if (loadingMode === LoadingTrigger.VIEWPORT) {
        // replace all rows with skeletons to maintain the same scroll position
        addSkeletonRows();
      }

      const rangeParams =
        loadingMode === LoadingTrigger.VIEWPORT
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

      privateApiRef.current.publishEvent('getRows', getRowsParams);
    },
    [
      privateApiRef,
      isDisabled,
      loadingMode,
      filterModel,
      paginationModel.pageSize,
      renderContext,
      addSkeletonRows,
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
  useGridApiEventHandler(privateApiRef, 'scrollPositionChange', handleScrolling);
  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    throttledHandleRenderedRowsIntervalChange,
  );
  useGridApiEventHandler(privateApiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
};
