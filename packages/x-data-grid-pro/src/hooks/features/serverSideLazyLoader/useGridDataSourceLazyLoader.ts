import * as React from 'react';
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
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridGetRowsParams,
  gridRenderContextSelector,
  throttle,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection } from '../lazyLoader/utils';
import { GRID_SKELETON_ROW_ROOT_ID } from '../lazyLoader/useGridLazyLoaderPreProcessors';

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
    'pagination' | 'paginationMode' | 'unstable_dataSource' | 'lazyLoading'
  >,
): void => {
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const paginationModel = useGridSelector(privateApiRef, gridPaginationModelSelector);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const isDisabled = !props.unstable_dataSource || props.lazyLoading !== true;

  const addSkeletonRows = React.useCallback(() => {
    if (isDisabled) {
      return;
    }

    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rowCount = privateApiRef.current.getRowsCount();

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
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, isDisabled]);

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
    () => throttle(handleRenderedRowsIntervalChange, 300), // TODO: make it configurable
    [handleRenderedRowsIntervalChange],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      if (isDisabled) {
        return;
      }

      const renderContext = gridRenderContextSelector(privateApiRef);
      // replace all rows with skeletons to maintain the same scroll position
      privateApiRef.current.setRows([]);
      addSkeletonRows();

      renderedRowsIntervalCache.current = INTERVAL_CACHE_INITIAL_STATE;

      const getRowsParams: GridGetRowsParams = {
        start: renderContext.firstRowIndex,
        end: renderContext.lastRowIndex,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.publishEvent('getRows', getRowsParams);
    },
    [privateApiRef, isDisabled, filterModel, addSkeletonRows],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      if (isDisabled) {
        return;
      }

      privateApiRef.current.setRows([]);
      renderedRowsIntervalCache.current = INTERVAL_CACHE_INITIAL_STATE;

      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.publishEvent('getRows', getRowsParams);
    },
    [privateApiRef, isDisabled, sortModel, paginationModel.pageSize],
  );

  useGridApiEventHandler(privateApiRef, 'rowsFetched', addSkeletonRows);
  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    throttledHandleRenderedRowsIntervalChange,
  );
  useGridApiEventHandler(privateApiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
};
