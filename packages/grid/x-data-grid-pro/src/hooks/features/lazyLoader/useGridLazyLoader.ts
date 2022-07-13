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
  GridRowEntry,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { getRenderableIndexes } from '@mui/x-data-grid/hooks/features/virtualization/useGridVirtualScroller';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  DataGridProProcessedProps,
  GridExperimentalProFeatures,
} from '../../../models/dataGridProProps';
import { GRID_SKELETON_ROW_ROOT_ID } from './useGridLazyLoaderPreProcessors';
import { GridFetchRowsParams } from '../../../models/gridFetchRowsParams';

function findSkeletonRowsSection(
  visibleRows: GridRowEntry<any>[],
  range: { firstRowIndex: number; lastRowIndex: number },
): { firstRowIndex: number; lastRowIndex: number } {
  const visibleRowsSection = visibleRows.slice(range.firstRowIndex, range.lastRowIndex);
  let firstRowIndex = range.firstRowIndex;
  let lastRowIndex = range.lastRowIndex;
  let startIndex = 0;
  let endIndex = visibleRowsSection.length - 1;
  let isSkeletonSectionFound = false;

  while (!isSkeletonSectionFound && firstRowIndex < lastRowIndex) {
    if (!visibleRowsSection[startIndex].model && !visibleRowsSection[endIndex].model) {
      isSkeletonSectionFound = true;
    }

    if (visibleRowsSection[startIndex].model) {
      startIndex += 1;
      firstRowIndex += 1;
    }

    if (visibleRowsSection[endIndex].model) {
      endIndex -= 1;
      lastRowIndex -= 1;
    }
  }

  return {
    firstRowIndex,
    lastRowIndex,
  };
}

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
    | 'onFetchRows'
    | 'rowsLoadingMode'
    | 'pagination'
    | 'paginationMode'
    | 'rowBuffer'
    | 'experimentalFeatures'
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
        !(props.experimentalFeatures as GridExperimentalProFeatures)?.lazyLoading ||
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
      const hasSkeletonRowIds = renderedRowsIds.some((rowId) =>
        `${rowId}`.includes(GRID_SKELETON_ROW_ROOT_ID),
      );

      if (!hasSkeletonRowIds) {
        return;
      }

      const { firstRowIndex, lastRowIndex } = findSkeletonRowsSection(visibleRows.rows, {
        firstRowIndex: params.firstRowToRender,
        lastRowIndex: params.lastRowToRender,
      });

      renderedRowsIntervalCache.current = params;

      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender: firstRowIndex,
        lastRowToRender: lastRowIndex,
        sortModel,
        filterModel,
      };

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [
      apiRef,
      props.rowsLoadingMode,
      rowIds,
      sortModel,
      filterModel,
      visibleRows,
      props.experimentalFeatures,
    ],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (
        !(props.experimentalFeatures as GridExperimentalProFeatures)?.lazyLoading ||
        !dimensions ||
        props.rowsLoadingMode !== GridFeatureModeConstant.server
      ) {
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
    [
      apiRef,
      props.rowsLoadingMode,
      props.rowBuffer,
      visibleRows.rows,
      filterModel,
      props.experimentalFeatures,
    ],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (
        !(props.experimentalFeatures as GridExperimentalProFeatures)?.lazyLoading ||
        !dimensions ||
        props.rowsLoadingMode !== GridFeatureModeConstant.server
      ) {
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
    [
      apiRef,
      props.rowsLoadingMode,
      props.rowBuffer,
      visibleRows.rows,
      sortModel,
      props.experimentalFeatures,
    ],
  );

  useGridApiEventHandler(apiRef, 'renderedRowsIntervalChange', handleRenderedRowsIntervalChange);
  useGridApiEventHandler(apiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(apiRef, 'filterModelChange', handleGridFilterModelChange);
  useGridApiOptionHandler(apiRef, 'fetchRows', props.onFetchRows);
};
