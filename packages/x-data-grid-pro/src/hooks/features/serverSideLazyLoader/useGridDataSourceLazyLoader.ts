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
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridGetRowsParams,
  gridRenderContextSelector,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  runIf,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection } from '../lazyLoader/utils';
import { GRID_SKELETON_ROW_ROOT_ID } from '../lazyLoader/useGridLazyLoaderPreProcessors';
import { DataSourceRowsUpdateStrategy } from '../dataSource/utils';

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
    | 'unstable_lazyLoading'
    | 'unstable_lazyLoadingRequestThrottleMs'
    | 'scrollEndThreshold'
  >,
): void => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.LazyLoading,
      props.unstable_dataSource && props.unstable_lazyLoading ? () => true : () => false,
    );
  }, [privateApiRef, props.unstable_lazyLoading, props.unstable_dataSource]);

  const [lazyLoadingRowsUpdateStrategyActive, setLazyLoadingRowsUpdateStrategyActive] =
    React.useState(false);
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const paginationModel = useGridSelector(privateApiRef, gridPaginationModelSelector);
  const filteredSortedRowIds = useGridSelector(privateApiRef, gridFilteredSortedRowIdsSelector);
  const dimensions = useGridSelector(privateApiRef, gridDimensionsSelector);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const previousLastRowIndex = React.useRef(0);
  const loadingTrigger = React.useRef<LoadingTrigger | null>(null);
  const rowsStale = React.useRef<boolean>(false);

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
    privateApiRef.current.setLoading(true);
    privateApiRef.current.unstable_dataSource.cache.clear();
    rowsStale.current = true;
    previousLastRowIndex.current = 0;
    const getRowsParams: GridGetRowsParams = {
      start: 0,
      end: paginationModel.pageSize - 1,
      sortModel,
      filterModel,
    };

    privateApiRef.current.unstable_dataSource.fetchRows(GRID_ROOT_GROUP_ID, getRowsParams);
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

  const addSkeletonRows = React.useCallback(() => {
    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rootChildrenCount = rootGroupChildren.length;

    /**
     * Do nothing if
     * - rowCount is unknown
     * - children count is 0
     * - children count is equal to rowCount
     */
    if (
      pageRowCount === -1 ||
      pageRowCount === undefined ||
      rootChildrenCount === 0 ||
      rootChildrenCount === pageRowCount
    ) {
      return;
    }

    // fill the grid with skeleton rows
    for (let i = 0; i < pageRowCount - rootChildrenCount; i += 1) {
      const skeletonId = getSkeletonRowId(i + rootChildrenCount); // to avoid duplicate keys on rebuild
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

  const rebuildSkeletonRows = React.useCallback(() => {
    // replace all data rows with skeleton rows.
    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    for (let i = 0; i < rootGroupChildren.length; i += 1) {
      if (tree[rootGroupChildren[i]]?.type === 'skeletonRow') {
        continue;
      }

      const skeletonId = getSkeletonRowId(i);
      rootGroupChildren[i] = skeletonId;

      const skeletonRowNode: GridSkeletonRowNode = {
        type: 'skeletonRow',
        id: skeletonId,
        parent: GRID_ROOT_GROUP_ID,
        depth: 0,
      };

      tree[rootGroupChildren[i]] = skeletonRowNode;
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

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        return;
      }

      const { response, fetchParams } = params;
      const pageRowCount = privateApiRef.current.state.pagination.rowCount;
      if (response.rowCount !== undefined || pageRowCount === undefined) {
        privateApiRef.current.setRowCount(response.rowCount === undefined ? -1 : response.rowCount);
      }

      // scroll to the top if the rows are stale and the new request is for the first page
      if (rowsStale.current && params.fetchParams.start === 0) {
        privateApiRef.current.scroll({ top: 0 });
        // the rows can safely be replaced. skeleton rows will be added later
        privateApiRef.current.setRows(response.rows);
      } else {
        // having stale rows while not having a request for the first page means that the scroll position should be maintained
        // convert all existing data to skeleton rows to avoid duplicate keys
        if (rowsStale.current) {
          rebuildSkeletonRows();
        }

        const startingIndex =
          typeof fetchParams.start === 'string'
            ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
            : fetchParams.start;

        privateApiRef.current.unstable_replaceRows(startingIndex, response.rows);
      }

      rowsStale.current = false;

      if (loadingTrigger.current === null) {
        updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
      }

      addSkeletonRows();
      privateApiRef.current.setLoading(false);
      privateApiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        false,
      );
      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [
      privateApiRef,
      filteredSortedRowIds,
      updateLoadingTrigger,
      rebuildSkeletonRows,
      addSkeletonRows,
    ],
  );

  const handleRowCountChange = React.useCallback(() => {
    if (loadingTrigger.current === null) {
      return;
    }

    updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
    addSkeletonRows();
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, updateLoadingTrigger, addSkeletonRows]);

  const handleScrolling: GridEventListener<'scrollPositionChange'> = React.useCallback(
    (newScrollPosition) => {
      const renderContext = gridRenderContextSelector(privateApiRef);
      if (
        loadingTrigger.current !== LoadingTrigger.SCROLL_END ||
        previousLastRowIndex.current >= renderContext.lastRowIndex
      ) {
        return;
      }

      const position = newScrollPosition.top + dimensions.viewportInnerSize.height;
      const target = dimensions.contentSize.height - props.scrollEndThreshold;

      if (position >= target) {
        previousLastRowIndex.current = renderContext.lastRowIndex;

        const getRowsParams: GridGetRowsParams = {
          start: renderContext.lastRowIndex,
          end: renderContext.lastRowIndex + paginationModel.pageSize - 1,
          sortModel,
          filterModel,
        };

        privateApiRef.current.setLoading(true);
        privateApiRef.current.unstable_dataSource.fetchRows(
          GRID_ROOT_GROUP_ID,
          adjustRowParams(getRowsParams),
        );
      }
    },
    [
      privateApiRef,
      props.scrollEndThreshold,
      sortModel,
      filterModel,
      dimensions,
      paginationModel.pageSize,
      adjustRowParams,
    ],
  );

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (loadingTrigger.current !== LoadingTrigger.VIEWPORT) {
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

      privateApiRef.current.unstable_dataSource.fetchRows(
        GRID_ROOT_GROUP_ID,
        adjustRowParams(getRowsParams),
      );
    },
    [
      privateApiRef,
      props.pagination,
      props.paginationMode,
      sortModel,
      filterModel,
      adjustRowParams,
    ],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, props.unstable_lazyLoadingRequestThrottleMs),
    [props.unstable_lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      rowsStale.current = true;
      previousLastRowIndex.current = 0;
      const renderContext = gridRenderContextSelector(privateApiRef);
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

      privateApiRef.current.setLoading(true);
      privateApiRef.current.unstable_dataSource.fetchRows(
        GRID_ROOT_GROUP_ID,
        adjustRowParams(getRowsParams),
      );
    },
    [privateApiRef, filterModel, paginationModel.pageSize, adjustRowParams],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      rowsStale.current = true;
      previousLastRowIndex.current = 0;
      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.setLoading(true);
      privateApiRef.current.unstable_dataSource.fetchRows(GRID_ROOT_GROUP_ID, getRowsParams);
    },
    [privateApiRef, sortModel, paginationModel.pageSize],
  );

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    setLazyLoadingRowsUpdateStrategyActive(
      privateApiRef.current.getActiveStrategy(GridStrategyGroup.DataSource) ===
        DataSourceRowsUpdateStrategy.LazyLoading,
    );
  }, [privateApiRef]);

  useGridRegisterStrategyProcessor(
    privateApiRef,
    DataSourceRowsUpdateStrategy.LazyLoading,
    'dataSourceRowsUpdate',
    handleDataUpdate,
  );

  useGridApiEventHandler(privateApiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  useGridApiEventHandler(
    privateApiRef,
    'rowCountChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleRowCountChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'scrollPositionChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleScrolling),
  );
  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, throttledHandleRenderedRowsIntervalChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'sortModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridSortModelChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'filterModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridFilterModelChange),
  );

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
