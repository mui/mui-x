import * as React from 'react';
import {
  useGridApiEventHandler,
  GridFeatureModeConstant,
  GridRenderedRowsIntervalChangeParams,
  useGridSelector,
  gridSortModelSelector,
  gridFilterModelSelector,
  useGridApiOptionHandler,
  GridEventListener,
  GridRowEntry,
  GridDimensions,
  GridFeatureMode,
} from '@mui/x-data-grid';
import { useGridVisibleRows, getRenderableIndexes } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  DataGridProProcessedProps,
  GridExperimentalProFeatures,
} from '../../../models/dataGridProProps';
import { GridFetchRowsParams } from '../../../models/gridFetchRowsParams';

function findSkeletonRowsSection(
  visibleRows: GridRowEntry[],
  range: { firstRowIndex: number; lastRowIndex: number },
) {
  let { firstRowIndex, lastRowIndex } = range;
  const visibleRowsSection = visibleRows.slice(range.firstRowIndex, range.lastRowIndex);
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

  if (rowsLoadingMode !== GridFeatureModeConstant.server) {
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
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const renderedRowsIntervalCache = React.useRef<GridRenderedRowsIntervalChangeParams>({
    firstRowToRender: 0,
    lastRowToRender: 0,
  });
  const { lazyLoading } = (props.experimentalFeatures ?? {}) as GridExperimentalProFeatures;

  const getCurrentIntervalToRender = React.useCallback(() => {
    const currentRenderContext = apiRef.current.unstable_getRenderContext();
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: currentRenderContext.firstRowIndex,
      lastIndex: currentRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: visibleRows.rows.length,
      buffer: props.rowBuffer,
    });

    return {
      firstRowToRender,
      lastRowToRender,
    };
  }, [apiRef, props.rowBuffer, visibleRows.rows.length]);

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      const dimensions = apiRef.current.getRootDimensions();

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
        firstRowToRender: params.firstRowToRender,
        lastRowToRender: params.lastRowToRender,
        sortModel,
        filterModel,
      };

      if (
        renderedRowsIntervalCache.current.firstRowToRender === params.firstRowToRender &&
        renderedRowsIntervalCache.current.lastRowToRender === params.lastRowToRender
      ) {
        return;
      }

      if (sortModel.length === 0 && filterModel.items.length === 0) {
        const skeletonRowsSection = findSkeletonRowsSection(visibleRows.rows, {
          firstRowIndex: params.firstRowToRender,
          lastRowIndex: params.lastRowToRender,
        });

        if (!skeletonRowsSection) {
          return;
        }

        fetchRowsParams.firstRowToRender = skeletonRowsSection.firstRowIndex;
        fetchRowsParams.lastRowToRender = skeletonRowsSection.lastRowIndex;
      }

      renderedRowsIntervalCache.current = params;

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, sortModel, filterModel, visibleRows.rows, lazyLoading],
  );

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      const dimensions = apiRef.current.getRootDimensions();
      if (
        isLazyLoadingDisabled({
          lazyLoadingFeatureFlag: lazyLoading,
          rowsLoadingMode: props.rowsLoadingMode,
          gridDimensions: dimensions,
        })
      ) {
        return;
      }

      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');

      const { firstRowToRender, lastRowToRender } = getCurrentIntervalToRender();
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender,
        lastRowToRender,
        sortModel: newSortModel,
        filterModel,
      };

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, filterModel, lazyLoading, getCurrentIntervalToRender],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      const dimensions = apiRef.current.getRootDimensions();

      if (
        isLazyLoadingDisabled({
          lazyLoadingFeatureFlag: lazyLoading,
          rowsLoadingMode: props.rowsLoadingMode,
          gridDimensions: dimensions,
        })
      ) {
        return;
      }

      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');

      const { firstRowToRender, lastRowToRender } = getCurrentIntervalToRender();
      const fetchRowsParams: GridFetchRowsParams = {
        firstRowToRender,
        lastRowToRender,
        sortModel,
        filterModel: newFilterModel,
      };

      apiRef.current.publishEvent('fetchRows', fetchRowsParams);
    },
    [apiRef, props.rowsLoadingMode, sortModel, lazyLoading, getCurrentIntervalToRender],
  );

  useGridApiEventHandler(apiRef, 'renderedRowsIntervalChange', handleRenderedRowsIntervalChange);
  useGridApiEventHandler(apiRef, 'sortModelChange', handleGridSortModelChange);
  useGridApiEventHandler(apiRef, 'filterModelChange', handleGridFilterModelChange);
  useGridApiOptionHandler(apiRef, 'fetchRows', props.onFetchRows);
};
