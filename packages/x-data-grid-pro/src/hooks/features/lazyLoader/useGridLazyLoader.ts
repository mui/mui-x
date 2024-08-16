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
} from '@mui/x-data-grid';
import { getVisibleRows } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
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
    'onFetchRows' | 'rowsLoadingMode' | 'pagination' | 'paginationMode' | 'experimentalFeatures'
  >,
): void => {
  const sortModel = useGridSelector(privateApiRef, gridSortModelSelector);
  const filterModel = useGridSelector(privateApiRef, gridFilterModelSelector);
  const renderedRowsIntervalCache = React.useRef({
    firstRowToRender: 0,
    lastRowToRender: 0,
  });
  const isDisabled = props.rowsLoadingMode !== 'server';

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (isDisabled) {
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

        fetchRowsParams.firstRowToRender = skeletonRowsSection.firstRowIndex;
        fetchRowsParams.lastRowToRender = skeletonRowsSection.lastRowIndex;
      }

      privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [privateApiRef, isDisabled, props.pagination, props.paginationMode, sortModel, filterModel],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      if (isDisabled) {
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
    [privateApiRef, isDisabled, filterModel],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      if (isDisabled) {
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
    [privateApiRef, isDisabled, sortModel],
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
