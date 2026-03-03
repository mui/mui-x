'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { throttle } from '@mui/x-internals/throttle';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import useEventCallback from '@mui/utils/useEventCallback';
import debounce from '@mui/utils/debounce';
import {
  useGridEvent,
  gridSortModelSelector,
  gridFilterModelSelector,
  type GridEventListener,
  GRID_ROOT_GROUP_ID,
  type GridGroupNode,
  type GridSkeletonRowNode,
  gridPaginationModelSelector,
  gridFilteredSortedRowIdsSelector,
  gridRowIdSelector,
  type GridRowId,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  gridRenderContextSelector,
  GridStrategyGroup,
  type GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  runIf,
  DataSourceRowsUpdateStrategy,
} from '@mui/x-data-grid/internals';
import type { GridGetRowsParamsPro as GridGetRowsParams } from '../dataSource/models';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection, adjustRowParams } from '../lazyLoader/utils';
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
 * @requires useGridScroll (method
 */
export const useGridDataSourceLazyLoader = (
  privateApiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'dataSource' | 'lazyLoading' | 'lazyLoadingRequestThrottleMs' | 'dataSourceRevalidateMs'
  >,
): void => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.LazyLoading,
      props.dataSource && props.lazyLoading ? () => true : () => false,
    );
  }, [privateApiRef, props.lazyLoading, props.dataSource]);

  const [lazyLoadingRowsUpdateStrategyActive, setLazyLoadingRowsUpdateStrategyActive] =
    React.useState(false);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const previousLastRowIndex = React.useRef(0);
  const loadingTrigger = React.useRef<LoadingTrigger | null>(null);
  const rowsStale = React.useRef<boolean>(false);
  const draggedRowId = React.useRef<GridRowId | null>(null);
  const pollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRows = React.useCallback(
    (params: Partial<GridGetRowsParams>) => {
      privateApiRef.current.dataSource.fetchRows(GRID_ROOT_GROUP_ID, params);
    },
    [privateApiRef],
  );

  const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);

  const revalidate = useEventCallback((params: Partial<GridGetRowsParams>) => {
    if (rowsStale.current) {
      return;
    }

    // Check cache first — if data is still cached, skip entirely
    // (no backend call, no diffing needed)
    const cache = privateApiRef.current.dataSource.cache;
    const cachedResponse = cache.get(params as GridGetRowsParams);
    if (cachedResponse !== undefined) {
      return;
    }

    // Cache is stale/expired — fetch in background (no loading indicator)
    debouncedFetchRows(params);
  });

  const stopPolling = React.useCallback(() => {
    if (pollingIntervalRef.current !== null) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const startPolling = useEventCallback((params: Partial<GridGetRowsParams>) => {
    stopPolling();

    if (props.dataSourceRevalidateMs <= 0) {
      return;
    }

    pollingIntervalRef.current = setInterval(() => {
      revalidate(params);
    }, props.dataSourceRevalidateMs);
  });

  const resetGrid = React.useCallback(() => {
    privateApiRef.current.setLoading(true);
    privateApiRef.current.dataSource.cache.clear();
    rowsStale.current = true;
    previousLastRowIndex.current = 0;
    const paginationModel = gridPaginationModelSelector(privateApiRef);
    const sortModel = gridSortModelSelector(privateApiRef);
    const filterModel = gridFilterModelSelector(privateApiRef);
    const getRowsParams: GridGetRowsParams = {
      start: 0,
      end: paginationModel.pageSize - 1,
      sortModel,
      filterModel,
    };

    fetchRows(getRowsParams);
  }, [privateApiRef, fetchRows]);

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
     * - children count is 0
     */
    if (rootChildrenCount === 0) {
      return;
    }

    let hasChanged = false;

    // SWR: Only add skeleton padding for never-fetched positions beyond current data.
    // Previously fetched rows are kept in place (not skeletonized) to avoid flicker on scroll-back.
    // Should only happen with VIEWPORT loading trigger
    if (loadingTrigger.current === LoadingTrigger.VIEWPORT) {
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
        hasChanged = true;
      }
    }

    if (!hasChanged) {
      return;
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

      if (loadingTrigger.current !== null) {
        ensureValidRowCount(loadingTrigger.current, newLoadingTrigger);
      }

      if (loadingTrigger.current !== newLoadingTrigger) {
        loadingTrigger.current = newLoadingTrigger;
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
      const tree = privateApiRef.current.state.rows.tree;
      const dataRowIdToModelLookup = privateApiRef.current.state.rows.dataRowIdToModelLookup;
      if (response.rowCount !== undefined || pageRowCount === undefined) {
        privateApiRef.current.setRowCount(response.rowCount === undefined ? -1 : response.rowCount);
      }

      // scroll to the top if the rows are stale and the new request is for the first page
      if (rowsStale.current && params.fetchParams.start === 0) {
        privateApiRef.current.scroll({ top: 0 });
        // the rows can safely be replaced. skeleton rows will be added later
        privateApiRef.current.setRows(response.rows);
      } else {
        const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
        const rootGroupChildren = [...rootGroup.children];
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(privateApiRef);

        const startingIndex =
          typeof fetchParams.start === 'string'
            ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
            : fetchParams.start;

        // Determine if this is a background revalidation (target rows are real, not skeletons)
        const firstTargetRow = rootGroupChildren[startingIndex];
        const isRevalidation = firstTargetRow && tree[firstTargetRow]?.type !== 'skeletonRow';

        if (isRevalidation) {
          // --- SWR PATH ---
          // Compare response row IDs with existing row IDs at target positions
          const newRowIds = response.rows.map((row) => gridRowIdSelector(privateApiRef, row));
          const existingRowIds = rootGroupChildren.slice(
            startingIndex,
            startingIndex + response.rows.length,
          );
          const sameRowIds =
            existingRowIds.length === newRowIds.length &&
            existingRowIds.every((id, i) => id === newRowIds[i]);

          if (sameRowIds) {
            // SAME ROW IDs — check for data changes only
            const changedRows = response.rows.filter((newRow, i) => {
              const existingRow = dataRowIdToModelLookup[existingRowIds[i]];
              return !isDeepEqual(newRow, existingRow);
            });

            if (changedRows.length === 0) {
              // No changes — skip update entirely. Cache already refreshed by fetchRows.
              privateApiRef.current.setLoading(false);
              return;
            }

            // Efficient data-only update — no tree restructuring needed
            privateApiRef.current.updateRows(changedRows);
            // Cache is already updated by fetchRows in useGridDataSourceBase
          } else {
            // DIFFERENT ROW IDs — server returned new rows for this range
            // 1. Remove old rows at target positions
            for (
              let i = startingIndex;
              i < startingIndex + response.rows.length && i < rootGroupChildren.length;
              i += 1
            ) {
              const oldRowId = rootGroupChildren[i];
              if (oldRowId && tree[oldRowId]?.type !== 'skeletonRow') {
                delete tree[oldRowId];
                delete dataRowIdToModelLookup[oldRowId];
                const skeletonId = getSkeletonRowId(i);
                rootGroupChildren[i] = skeletonId;
                tree[skeletonId] = {
                  type: 'skeletonRow',
                  id: skeletonId,
                  parent: GRID_ROOT_GROUP_ID,
                  depth: 0,
                };
              }
            }

            // 2. Duplicate detection for incoming rows
            let duplicateRowCount = 0;
            response.rows.forEach((row) => {
              const rowId = gridRowIdSelector(privateApiRef, row);
              if (tree[rowId] || dataRowIdToModelLookup[rowId]) {
                const index = rootGroupChildren.indexOf(rowId);
                if (index !== -1) {
                  const skeletonId = getSkeletonRowId(index);
                  rootGroupChildren[index] = skeletonId;
                  tree[skeletonId] = {
                    type: 'skeletonRow',
                    id: skeletonId,
                    parent: GRID_ROOT_GROUP_ID,
                    depth: 0,
                  };
                }
                delete tree[rowId];
                delete dataRowIdToModelLookup[rowId];
                duplicateRowCount += 1;
              }
            });

            if (duplicateRowCount > 0) {
              tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };
              privateApiRef.current.setState((state) => ({
                ...state,
                rows: {
                  ...state.rows,
                  tree,
                  dataRowIdToModelLookup,
                },
              }));
            }

            // 3. Replace rows
            privateApiRef.current.unstable_replaceRows(startingIndex, response.rows);
          }
        } else {
          // --- ORIGINAL PATH (skeleton → real row replacement) ---
          // Check for duplicate rows
          let duplicateRowCount = 0;
          response.rows.forEach((row) => {
            const rowId = gridRowIdSelector(privateApiRef, row);
            if (tree[rowId] || dataRowIdToModelLookup[rowId]) {
              const index = rootGroupChildren.indexOf(rowId);
              if (index !== -1) {
                const skeletonId = getSkeletonRowId(index);
                rootGroupChildren[index] = skeletonId;
                tree[skeletonId] = {
                  type: 'skeletonRow',
                  id: skeletonId,
                  parent: GRID_ROOT_GROUP_ID,
                  depth: 0,
                };
              }
              delete tree[rowId];
              delete dataRowIdToModelLookup[rowId];
              duplicateRowCount += 1;
            }
          });

          if (duplicateRowCount > 0) {
            tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };
            privateApiRef.current.setState((state) => ({
              ...state,
              rows: {
                ...state.rows,
                tree,
                dataRowIdToModelLookup,
              },
            }));
          }

          privateApiRef.current.unstable_replaceRows(startingIndex, response.rows);
        }
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
      if (loadingTrigger.current === LoadingTrigger.VIEWPORT) {
        startPolling(params.fetchParams);
      }
      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [privateApiRef, updateLoadingTrigger, addSkeletonRows, startPolling],
  );

  const handleRowCountChange = React.useCallback(() => {
    if (rowsStale.current || loadingTrigger.current === null) {
      return;
    }

    updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
    addSkeletonRows();
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, updateLoadingTrigger, addSkeletonRows]);

  const handleIntersection: GridEventListener<'rowsScrollEndIntersection'> = useEventCallback(
    () => {
      if (rowsStale.current || loadingTrigger.current !== LoadingTrigger.SCROLL_END) {
        return;
      }

      const renderContext = gridRenderContextSelector(privateApiRef);
      if (previousLastRowIndex.current >= renderContext.lastRowIndex) {
        return;
      }

      previousLastRowIndex.current = renderContext.lastRowIndex;

      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const sortModel = gridSortModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: renderContext.lastRowIndex,
        end: renderContext.lastRowIndex + paginationModel.pageSize - 1,
        sortModel,
        filterModel,
      };

      privateApiRef.current.setLoading(true);

      fetchRows(
        adjustRowParams(getRowsParams, {
          pageSize: paginationModel.pageSize,
          rowCount: privateApiRef.current.state.pagination.rowCount,
        }),
      );
    },
  );

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (renderContext) => {
      if (rowsStale.current) {
        return;
      }

      const sortModel = gridSortModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: renderContext.firstRowIndex,
        end: renderContext.lastRowIndex - 1,
        sortModel,
        filterModel,
      };

      if (
        renderedRowsIntervalCache.current.firstRowToRender === renderContext.firstRowIndex &&
        renderedRowsIntervalCache.current.lastRowToRender === renderContext.lastRowIndex
      ) {
        return;
      }

      renderedRowsIntervalCache.current = {
        firstRowToRender: renderContext.firstRowIndex,
        lastRowToRender: renderContext.lastRowIndex,
      };

      const currentVisibleRows = getVisibleRows(privateApiRef);

      const skeletonRowsSection = findSkeletonRowsSection({
        apiRef: privateApiRef,
        visibleRows: currentVisibleRows.rows,
        range: renderContext,
      });

      const paginationModel = gridPaginationModelSelector(privateApiRef);
      if (!skeletonRowsSection) {
        // SWR: No skeleton rows in viewport — all visible rows have real data.
        // Schedule background revalidation if cache has expired for this range.
        if (loadingTrigger.current === LoadingTrigger.VIEWPORT) {
          const adjustedParams = adjustRowParams(getRowsParams, {
            pageSize: paginationModel.pageSize,
            rowCount: privateApiRef.current.state.pagination.rowCount,
          });
          revalidate(adjustedParams);
          startPolling(adjustedParams);
        }
        return;
      }

      getRowsParams.start = skeletonRowsSection.firstRowIndex;
      getRowsParams.end = skeletonRowsSection.lastRowIndex;

      fetchRows(
        adjustRowParams(getRowsParams, {
          pageSize: paginationModel.pageSize,
          rowCount: privateApiRef.current.state.pagination.rowCount,
        }),
      );
    },
    [privateApiRef, fetchRows, revalidate, startPolling],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, props.lazyLoadingRequestThrottleMs),
    [props.lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange],
  );

  React.useEffect(() => {
    return () => {
      throttledHandleRenderedRowsIntervalChange.clear();
      stopPolling();
    };
  }, [throttledHandleRenderedRowsIntervalChange, stopPolling]);

  // Stop polling when dataSourceRevalidateMs is set to 0
  React.useEffect(() => {
    if (props.dataSourceRevalidateMs <= 0) {
      stopPolling();
    }
  }, [props.dataSourceRevalidateMs, stopPolling]);

  React.useEffect(() => stopPolling, [stopPolling]);

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();
      stopPolling();
      previousLastRowIndex.current = 0;
      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);

      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange, stopPolling],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();
      stopPolling();
      previousLastRowIndex.current = 0;

      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const sortModel = gridSortModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange, stopPolling],
  );

  const handleDragStart = React.useCallback<GridEventListener<'rowDragStart'>>((row) => {
    draggedRowId.current = row.id;
  }, []);

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(() => {
    draggedRowId.current = null;
  }, []);

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

  useGridEvent(privateApiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  useGridEvent(
    privateApiRef,
    'rowCountChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleRowCountChange),
  );
  useGridEvent(
    privateApiRef,
    'rowsScrollEndIntersection',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleIntersection),
  );
  useGridEvent(
    privateApiRef,
    'renderedRowsIntervalChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, throttledHandleRenderedRowsIntervalChange),
  );
  useGridEvent(
    privateApiRef,
    'sortModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridSortModelChange),
  );
  useGridEvent(
    privateApiRef,
    'filterModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridFilterModelChange),
  );
  useGridEvent(
    privateApiRef,
    'rowDragStart',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleDragStart),
  );
  useGridEvent(
    privateApiRef,
    'rowDragEnd',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleDragEnd),
  );

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
