import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridVirtualizationApi } from '../../../models/api/gridVirtualizationApi';
import {
  GridRenderContextProps,
  GridRenderRowProps,
  GridRenderColumnsProps,
} from '../../../models/gridRenderContextProps';
import { GridContainerProps } from '../../../models/gridContainerProps';
import { isDeepEqual } from '../../../utils/utils';
import { useEnhancedEffect } from '../../../utils/material-ui-utils';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { useGridState } from '../../utils/useGridState';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridScrollFn } from '../../utils/useGridScrollFn';
import { GridRenderingState } from './renderingState';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridStateInit } from '../../utils/useGridStateInit';

// Uses binary search to avoid looping through all possible positions
function getIdxFromScroll(
  offset: number,
  positions: number[],
  sliceStart = 0,
  sliceEnd = positions.length,
): number {
  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const itemOffset = positions[pivot];
  return offset <= itemOffset
    ? getIdxFromScroll(offset, positions, sliceStart, pivot)
    : getIdxFromScroll(offset, positions, pivot + 1, sliceEnd);
}

/**
 * @requires useGridColumns (state)
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * @requires useGridRows (state)
 */
export const useGridVirtualization = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'pagination'
    | 'paginationMode'
    | 'columnBuffer'
    | 'disableExtendRowFullWidth'
    | 'disableVirtualization'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridVirtualization');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    rendering: {
      realScroll: { left: 0, top: 0 },
      renderContext: null,
      renderingZoneScroll: { left: 0, top: 0 },
      virtualPage: 0,
      virtualRowsCount: 0,
    },
  }));

  const colRef = apiRef.current.columnHeadersElementRef!;
  const windowRef = apiRef.current.windowRef!;
  const renderingZoneRef = apiRef.current.renderingZoneRef!;

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const renderedColRef = React.useRef<GridRenderColumnsProps | null>(null);
  const containerPropsRef = React.useRef<GridContainerProps | null>(null);
  const lastScrollLeftRef = React.useRef<number>(0);

  const [scrollTo] = useGridScrollFn(apiRef, renderingZoneRef, colRef);

  const setRenderingState = React.useCallback(
    (newState: Partial<GridRenderingState>) => {
      let stateChanged = false;
      setGridState((state) => {
        const currentRenderingState = { ...state.rendering, ...newState };
        if (!isDeepEqual(state.rendering, currentRenderingState)) {
          stateChanged = true;

          return { ...state, rendering: currentRenderingState };
        }
        return state;
      });
      return stateChanged;
    },
    [setGridState],
  );

  const getRenderRowProps = React.useCallback(
    (page: number) => {
      if (apiRef.current.state.containerSizes == null) {
        return null;
      }
      let minRowIdx = 0;
      if (props.pagination && props.paginationMode === 'client') {
        minRowIdx = paginationState.pageSize * paginationState.page;
      }

      const firstRowIdx = page * apiRef.current.state.containerSizes.viewportPageSize + minRowIdx;
      let lastRowIdx = firstRowIdx + apiRef.current.state.containerSizes.renderingZonePageSize;
      const maxIndex = apiRef.current.state.containerSizes.virtualRowsCount + minRowIdx;
      if (lastRowIdx > maxIndex) {
        lastRowIdx = maxIndex;
      }

      const rowProps: GridRenderRowProps = { page, firstRowIdx, lastRowIdx };
      return rowProps;
    },
    [
      apiRef,
      props.pagination,
      paginationState.pageSize,
      props.paginationMode,
      paginationState.page,
    ],
  );

  const getRenderingState = React.useCallback((): Partial<GridRenderContextProps> | null => {
    if (apiRef.current.state.containerSizes == null) {
      return null;
    }

    const newRenderCtx: Partial<GridRenderContextProps> = {
      ...renderedColRef.current,
      ...getRenderRowProps(apiRef.current.state.rendering.virtualPage),
      paginationCurrentPage: paginationState.page,
      pageSize: paginationState.pageSize,
    };
    return newRenderCtx;
  }, [renderedColRef, getRenderRowProps, apiRef, paginationState.page, paginationState.pageSize]);

  const reRender = React.useCallback(() => {
    const renderingState = getRenderingState();
    const hasChanged = setRenderingState({ renderContext: renderingState });
    if (hasChanged) {
      logger.debug('reRender: trigger rendering');
      forceUpdate();
    }
  }, [getRenderingState, logger, forceUpdate, setRenderingState]);

  const getColumnIdxFromScroll = React.useCallback(
    (left: number) => getIdxFromScroll(left, columnsMeta.positions),
    [columnsMeta.positions],
  );

  const getColumnFromScroll = React.useCallback(
    (left: number) => {
      if (!visibleColumns.length) {
        return null;
      }
      return visibleColumns[getColumnIdxFromScroll(left)];
    },
    [getColumnIdxFromScroll, visibleColumns],
  );

  const updateRenderedCols = React.useCallback(
    (containerProps: GridContainerProps | null, scrollLeft: number) => {
      if (!containerProps) {
        return false;
      }

      containerPropsRef.current = containerProps;
      const windowWidth = containerProps.windowSizes.width;

      lastScrollLeftRef.current = scrollLeft;
      logger.debug(
        `GridColumns from ${getColumnFromScroll(scrollLeft)?.field} to ${
          getColumnFromScroll(scrollLeft + windowWidth)?.field
        }`,
      );
      const firstDisplayedIdx = getColumnIdxFromScroll(scrollLeft);
      const lastDisplayedIdx = getColumnIdxFromScroll(scrollLeft + windowWidth);
      const prevFirstColIdx = renderedColRef?.current?.firstColIdx || 0;
      const prevLastColIdx = renderedColRef?.current?.lastColIdx || 0;
      const columnBuffer = props.columnBuffer;
      const tolerance = columnBuffer > 1 ? columnBuffer - 1 : columnBuffer; // Math.floor(columnBuffer / 2);
      const diffFirst = Math.abs(firstDisplayedIdx - tolerance - prevFirstColIdx);
      const diffLast = Math.abs(lastDisplayedIdx + tolerance - prevLastColIdx);
      logger.debug(`Column buffer: ${columnBuffer}, tolerance: ${tolerance}`);
      logger.debug(`Previous values  => first: ${prevFirstColIdx}, last: ${prevLastColIdx}`);
      logger.debug(
        `Current displayed values  => first: ${firstDisplayedIdx}, last: ${lastDisplayedIdx}`,
      );
      logger.debug(`Difference with first: ${diffFirst} and last: ${diffLast} `);

      const lastVisibleColIdx = visibleColumns.length > 0 ? visibleColumns.length - 1 : 0;
      const firstColIdx =
        firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0;
      const newRenderedColState = {
        leftEmptyWidth: columnsMeta.positions[firstColIdx],
        rightEmptyWidth: 0,
        firstColIdx,
        lastColIdx:
          lastDisplayedIdx + columnBuffer >= lastVisibleColIdx
            ? lastVisibleColIdx
            : lastDisplayedIdx + columnBuffer,
      };

      if (apiRef.current.state.scrollBar.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          columnsMeta.totalWidth -
          columnsMeta.positions[newRenderedColState.lastColIdx] -
          visibleColumns[newRenderedColState.lastColIdx].computedWidth;
      } else if (!props.disableExtendRowFullWidth) {
        newRenderedColState.rightEmptyWidth =
          apiRef.current.state.viewportSizes.width - columnsMeta.totalWidth;
      }

      if (!isDeepEqual(newRenderedColState, renderedColRef.current)) {
        renderedColRef.current = newRenderedColState;
        logger.debug('New columns state to render', newRenderedColState);
        return true;
      }
      logger.debug(`No rendering needed on columns`);
      return false;
    },
    [
      apiRef,
      columnsMeta.positions,
      columnsMeta.totalWidth,
      getColumnFromScroll,
      getColumnIdxFromScroll,
      logger,
      props.columnBuffer,
      props.disableExtendRowFullWidth,
      visibleColumns,
    ],
  );

  const updateViewport = React.useCallback(
    (forceReRender = false) => {
      if (props.disableVirtualization) {
        return;
      }

      const lastState = apiRef.current.state;
      const containerProps = lastState.containerSizes;
      if (!windowRef || !windowRef.current || !containerProps) {
        return;
      }
      const scrollBar = lastState.scrollBar;

      const { scrollLeft, scrollTop } = windowRef.current;
      logger.debug(`Handling scroll Left: ${scrollLeft} Top: ${scrollTop}`);

      let requireRerender = updateRenderedCols(containerProps, scrollLeft);

      const rzScrollLeft = scrollLeft;
      const maxScrollHeight = lastState.containerSizes!.renderingZoneScrollHeight;

      const page = lastState.rendering.virtualPage;
      const nextPage = maxScrollHeight > 0 ? Math.floor(scrollTop / maxScrollHeight) : 0;
      const rzScrollTop = scrollTop % maxScrollHeight;

      const scrollParams = {
        left: scrollBar.hasScrollX ? rzScrollLeft : 0,
        top: containerProps.isVirtualized ? rzScrollTop : scrollTop,
      };

      if (containerProps.isVirtualized && page !== nextPage) {
        setRenderingState({ virtualPage: nextPage });
        logger.debug(`Changing page from ${page} to ${nextPage}`);
        requireRerender = true;
      } else {
        if (!containerProps.isVirtualized && page > 0) {
          logger.debug(`Virtualization disabled, setting virtualPage to 0`);
          setRenderingState({ virtualPage: 0 });
        }

        scrollTo(scrollParams);
      }
      setRenderingState({
        renderingZoneScroll: scrollParams,
        realScroll: {
          left: windowRef.current.scrollLeft,
          top: windowRef.current.scrollTop,
        },
      });
      apiRef.current.publishEvent(GridEvents.rowsScroll, scrollParams);

      const pageChanged =
        lastState.rendering.renderContext &&
        lastState.rendering.renderContext.paginationCurrentPage !== paginationState.page;
      if (forceReRender || requireRerender || pageChanged) {
        reRender();
      }
    },
    [
      apiRef,
      logger,
      paginationState.page,
      reRender,
      scrollTo,
      setRenderingState,
      updateRenderedCols,
      windowRef,
      props.disableVirtualization,
    ],
  );

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({ virtualPage: 0 });

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTop = 0;
      windowRef.current.scrollLeft = 0;
    }
    setRenderingState({ renderingZoneScroll: { left: 0, top: 0 } });
  }, [scrollTo, setRenderingState, windowRef]);

  const handleScroll = React.useCallback(() => {
    if (props.disableVirtualization) {
      return;
    }

    // On iOS the inertia scrolling allows to return negative values.
    if (windowRef.current!.scrollLeft < 0 || windowRef.current!.scrollTop < 0) {
      return;
    }

    if (apiRef.current.updateViewport) {
      apiRef.current.updateViewport();
    }
  }, [props.disableVirtualization, windowRef, apiRef]);

  const getContainerPropsState = React.useCallback(
    () => gridState.containerSizes,
    [gridState.containerSizes],
  );

  const getRenderContextState = React.useCallback(() => {
    return gridState.rendering.renderContext || undefined;
  }, [gridState.rendering.renderContext]);

  useEnhancedEffect(() => {
    if (props.disableVirtualization) {
      return;
    }

    if (renderingZoneRef && renderingZoneRef.current) {
      logger.debug('applying scrollTop ', gridState.rendering.renderingZoneScroll.top);
      scrollTo(gridState.rendering.renderingZoneScroll);
    }
  });

  const virtualApi: Partial<GridVirtualizationApi> = {
    getContainerPropsState,
    getRenderContextState,
    updateViewport,
  };
  useGridApiMethod(apiRef, virtualApi, 'GridVirtualizationApi');

  React.useEffect(() => {
    if (
      gridState.rendering.renderContext?.paginationCurrentPage !== paginationState.page &&
      apiRef.current.updateViewport
    ) {
      logger.debug(`State paginationState.page changed to ${paginationState.page}. `);
      apiRef.current.updateViewport(true);
      resetScroll();
    }
  }, [
    apiRef,
    paginationState.page,
    gridState.rendering.renderContext?.paginationCurrentPage,
    logger,
    resetScroll,
  ]);

  React.useEffect(() => {
    if (apiRef.current.updateViewport) {
      logger.debug(`totalRowCount has changed to ${totalRowCount}, updating viewport.`);
      apiRef.current.updateViewport(true);
    }
  }, [
    logger,
    totalRowCount,
    gridState.viewportSizes,
    gridState.scrollBar,
    gridState.containerSizes,
    apiRef,
  ]);

  useGridNativeEventListener(apiRef, windowRef, 'scroll', handleScroll, { passive: true });

  const resetRenderedColState = React.useCallback(() => {
    logger.debug('Clearing previous renderedColRef');
    renderedColRef.current = null;
  }, [logger, renderedColRef]);

  useGridApiEventHandler(apiRef, GridEvents.columnsChange, resetRenderedColState);
  useGridApiEventHandler(apiRef, GridEvents.debouncedResize, resetRenderedColState);
};
