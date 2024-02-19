import * as React from 'react';
import {
  useGridApiEventHandler,
  useGridSelector,
  gridSortModelSelector,
  gridFilterModelSelector,
  gridRenderContextSelector,
  useGridApiOptionHandler,
  GridEventListener,
  GridRowEntry,
  GridDimensions,
  GridFeatureMode,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import {
  DataGridProProcessedProps,
  GridExperimentalProFeatures,
} from '../../../models/dataGridProProps';
import { GridFetchRowsParams } from '../../../models/gridFetchRowsParams';

function findSkeletonRowsSection({
  apiRef,
  visibleRows,
  range,
}: {
  apiRef: React.MutableRefObject<GridPrivateApiPro>;
  visibleRows: GridRowEntry[];
  range: { firstRowIndex: number; lastRowIndex: number };
}) {
  let { firstRowIndex, lastRowIndex } = range;
  const visibleRowsSection = visibleRows.slice(range.firstRowIndex, range.lastRowIndex);
  let startIndex = 0;
  let endIndex = visibleRowsSection.length - 1;
  let isSkeletonSectionFound = false;

  while (!isSkeletonSectionFound && firstRowIndex < lastRowIndex) {
    const isStartingWithASkeletonRow =
      apiRef.current.getRowNode(visibleRowsSection[startIndex].id)?.type === 'skeletonRow';
    const isEndingWithASkeletonRow =
      apiRef.current.getRowNode(visibleRowsSection[endIndex].id)?.type === 'skeletonRow';

    if (isStartingWithASkeletonRow && isEndingWithASkeletonRow) {
      isSkeletonSectionFound = true;
    }

    if (!isStartingWithASkeletonRow) {
      startIndex += 1;
      firstRowIndex += 1;
    }

    if (!isEndingWithASkeletonRow) {
      endIndex -= 1;
      lastRowIndex -= 1;
    }
  }

  return isSkeletonSectionFound
    ? {
        firstRowIndex,
        lastRowIndex,
      }
    : undefined;
}

function isLazyLoadingDisabled({
  lazyLoadingFeatureFlag,
  rowsLoadingMode,
  gridDimensions,
}: {
  lazyLoadingFeatureFlag: boolean;
  rowsLoadingMode: GridFeatureMode;
  gridDimensions: GridDimensions | null;
}) {
  if (!lazyLoadingFeatureFlag || !gridDimensions) {
    return true;
  }

  if (rowsLoadingMode !== 'server') {
    return true;
  }

  return false;
}

/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridLazyLoader = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'onFetchRows'
    | 'rowsLoadingMode'
    | 'pagination'
    | 'paginationMode'
    | 'rowBuffer'
    | 'experimentalFeatures'
  >,
): void => {
  const visibleRows = useGridVisibleRows(privateApiRef, props);
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const renderedRowsIntervalCache = React.useRef({
    firstRowToRender: 0,
    lastRowToRender: 0,
  });
  const { lazyLoading } = (props.experimentalFeatures ?? {}) as GridExperimentalProFeatures;

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      const dimensions = privateApiRef.current.getRootDimensions();

      if (
        isLazyLoadingDisabled({
          lazyLoadingFeatureFlag: lazyLoading,
          rowsLoadingMode: props.rowsLoadingMode,
          gridDimensions: dimensions,
        })
      ) {
        return;
      }

      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender: params.firstRowIndex,
        lastRowToRender: params.lastRowIndex,
        sortModel,
        filterModel,
      };

      if (
        renderedRowsIntervalCache.current.firstRowToRender === params.firstRowIndex &&
        renderedRowsIntervalCache.current.lastRowToRender === params.lastRowIndex
      ) {
        return;
      }

      if (sortModel.length === 0 && filterModel.items.length === 0) {
        const skeletonRowsSection = findSkeletonRowsSection({
          apiRef: privateApiRef,
          visibleRows: visibleRows.rows,
          range: {
            firstRowIndex: params.firstRowIndex,
            lastRowIndex: params.lastRowIndex,
          },
        });

        if (!skeletonRowsSection) {
          return;
        }

        fetchRowsParams.firstRowToRender = skeletonRowsSection.firstRowIndex;
        fetchRowsParams.lastRowToRender = skeletonRowsSection.lastRowIndex;
      }

      renderedRowsIntervalCache.current = {
        firstRowToRender: params.firstRowIndex,
        lastRowToRender: params.lastRowIndex,
      };

      privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [privateApiRef, props.rowsLoadingMode, sortModel, filterModel, visibleRows.rows, lazyLoading],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      const dimensions = privateApiRef.current.getRootDimensions();
      if (
        isLazyLoadingDisabled({
          lazyLoadingFeatureFlag: lazyLoading,
          rowsLoadingMode: props.rowsLoadingMode,
          gridDimensions: dimensions,
        })
      ) {
        return;
      }

      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');

      const renderContext = gridRenderContextSelector(privateApiRef);
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender: renderContext.firstRowIndex,
        lastRowToRender: renderContext.lastRowIndex,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [privateApiRef, props.rowsLoadingMode, filterModel, lazyLoading],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      const dimensions = privateApiRef.current.getRootDimensions();

      if (
        isLazyLoadingDisabled({
          lazyLoadingFeatureFlag: lazyLoading,
          rowsLoadingMode: props.rowsLoadingMode,
          gridDimensions: dimensions,
        })
      ) {
        return;
      }

      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');

      const renderContext = gridRenderContextSelector(privateApiRef);
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender: renderContext.firstRowIndex,
        lastRowToRender: renderContext.lastRowIndex,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [privateApiRef, props.rowsLoadingMode, sortModel, lazyLoading],
  );

  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    handleRenderedRowsIntervalChange,
  );
  useGridApiEventHandler(privateApiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
  useGridApiOptionHandler(privateApiRef, 'fetchRows', props.onFetchRows);
};
