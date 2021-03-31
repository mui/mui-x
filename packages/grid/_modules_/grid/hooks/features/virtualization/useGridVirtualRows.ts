import * as React from 'react';
import {
  GRID_RESIZE,
  GRID_NATIVE_SCROLL,
  GRID_ROWS_SCROLL,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridVirtualizationApi } from '../../../models/api/gridVirtualizationApi';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridRenderContextProps, GridRenderRowProps } from '../../../models/gridRenderContextProps';
import { isDeepEqual } from '../../../utils/utils';
import { useEnhancedEffect } from '../../../utils/material-ui-utils';
import { optionsSelector } from '../../utils/optionsSelector';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { PaginationState } from '../pagination/gridPaginationReducer';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { useLogger } from '../../utils/useLogger';
import { useGridScrollFn } from '../../utils/useGridScrollFn';
import { InternalRenderingState } from './renderingState';
import { useGridVirtualColumns } from './useGridVirtualColumns';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { scrollStateSelector } from './renderingStateSelector';

export const useGridVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useGridVirtualRows');

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector<number>(apiRef, gridRowCountSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);

  const [scrollTo] = useGridScrollFn(renderingZoneRef, colRef);
  const [renderedColRef, updateRenderedCols] = useGridVirtualColumns(options, apiRef);

  const setRenderingState = React.useCallback(
    (state: Partial<InternalRenderingState>) => {
      let stateChanged = false;
      setGridState((oldState) => {
        const currentRenderingState = { ...oldState.rendering, ...state };
        if (!isDeepEqual(oldState.rendering, currentRenderingState)) {
          stateChanged = true;
          return { ...oldState, rendering: currentRenderingState };
        }
        return oldState;
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
      if (
        options.pagination &&
        paginationState.pageSize != null &&
        paginationState.paginationMode === 'client'
      ) {
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
      options.pagination,
      paginationState.pageSize,
      paginationState.paginationMode,
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
    const hasChanged = setRenderingState({
      renderContext: renderingState,
      renderedSizes: apiRef.current.state.containerSizes,
    });
    if (hasChanged) {
      logger.debug('reRender: trigger rendering');
      forceUpdate();
    }
  }, [apiRef, getRenderingState, logger, forceUpdate, setRenderingState]);

  const updateViewport = React.useCallback(
    (forceReRender = false) => {
      const lastState = apiRef.current.getState();
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
        scrollTo(scrollParams);
      }
      setRenderingState({
        renderingZoneScroll: scrollParams,
        realScroll: {
          left: windowRef.current.scrollLeft,
          top: windowRef.current.scrollTop,
        },
      });
      apiRef.current.publishEvent(GRID_ROWS_SCROLL, scrollParams);

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
    ],
  );

  const scrollToIndexes = React.useCallback(
    (params: GridCellIndexCoordinates) => {
      if (totalRowCount === 0 || visibleColumns.length === 0) {
        return false;
      }

      logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);

      let scrollLeft;
      const isColVisible = apiRef.current.isColumnVisibleInWindow(params.colIndex);
      logger.debug(`Column ${params.colIndex} is ${isColVisible ? 'already' : 'not'} visible.`);
      if (!isColVisible) {
        const isLastCol = params.colIndex + 1 === columnsMeta.positions.length;

        if (isLastCol) {
          const lastColWidth = visibleColumns[params.colIndex].width!;
          scrollLeft =
            columnsMeta.positions[params.colIndex] +
            lastColWidth -
            gridState.containerSizes!.windowSizes.width;
        } else {
          scrollLeft =
            columnsMeta.positions[params.colIndex + 1] -
            gridState.containerSizes!.windowSizes.width +
            gridState.scrollBar!.scrollBarSize.y;
          logger.debug(`Scrolling to the right, scrollLeft: ${scrollLeft}`);
        }
        if (gridState.rendering.renderingZoneScroll.left > scrollLeft) {
          scrollLeft = columnsMeta.positions[params.colIndex];
          logger.debug(`Scrolling to the left, scrollLeft: ${scrollLeft}`);
        }
      }

      let scrollTop;

      const currentRowPage =
        (params.rowIndex - gridState.pagination.page * gridState.pagination.pageSize) /
        gridState.containerSizes!.viewportPageSize;
      const scrollPosition = currentRowPage * gridState!.viewportSizes.height;
      const viewportHeight = gridState.viewportSizes.height;

      const isRowIndexAbove = windowRef.current!.scrollTop > scrollPosition;
      const isRowIndexBelow =
        windowRef.current!.scrollTop + viewportHeight < scrollPosition + rowHeight;

      if (isRowIndexAbove) {
        scrollTop = scrollPosition; // We put it at the top of the page
        logger.debug(`Row is above, setting scrollTop to ${scrollTop}`);
      } else if (isRowIndexBelow) {
        // We make sure the row is not half visible
        scrollTop = scrollPosition - viewportHeight + rowHeight;
        logger.debug(`Row is below, setting scrollTop to ${scrollTop}`);
      }

      const needScroll = !isColVisible || isRowIndexAbove || isRowIndexBelow;
      if (needScroll) {
        apiRef.current.scroll({
          left: scrollLeft,
          top: scrollTop,
        });
      }

      return needScroll;
    },
    [
      totalRowCount,
      visibleColumns,
      logger,
      apiRef,
      gridState,
      windowRef,
      rowHeight,
      columnsMeta.positions,
    ],
  );

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({ virtualPage: 0 });

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTo(0, 0);
    }
    setRenderingState({ renderingZoneScroll: { left: 0, top: 0 } });
  }, [scrollTo, setRenderingState, windowRef]);

  const scrollingTimeout = React.useRef<any>(null);
  const handleScroll = React.useCallback(() => {
    // On iOS the inertia scrolling allows to return negative values.
    if (windowRef.current!.scrollLeft < 0 || windowRef.current!.scrollTop < 0) return;

    if (!scrollingTimeout.current) {
      setGridState((state) => ({ ...state, isScrolling: true }));
    }
    clearTimeout(scrollingTimeout.current);
    scrollingTimeout.current = setTimeout(() => {
      scrollingTimeout.current = null;
      setGridState((state) => ({ ...state, isScrolling: false }));
      forceUpdate();
    }, 300);

    if (apiRef.current.updateViewport) {
      apiRef.current.updateViewport();
    }
  }, [windowRef, apiRef, setGridState, forceUpdate]);

  const scroll = React.useCallback(
    (params: Partial<GridScrollParams>) => {
      if (windowRef.current && params.left != null && colRef.current) {
        colRef.current.scrollLeft = params.left;
        windowRef.current.scrollLeft = params.left;
        logger.debug(`Scrolling left: ${params.left}`);
      }
      if (windowRef.current && params.top != null) {
        windowRef.current.scrollTop = params.top;
        logger.debug(`Scrolling top: ${params.top}`);
      }
      logger.debug(`Scrolling, updating container, and viewport`);
    },
    [windowRef, colRef, logger],
  );

  const getScrollPosition = React.useCallback(
    () => scrollStateSelector(apiRef.current.getState()),
    [apiRef],
  );

  const getContainerPropsState = React.useCallback(() => gridState.containerSizes, [
    gridState.containerSizes,
  ]);

  const getRenderContextState = React.useCallback(() => {
    return gridState.rendering.renderContext || undefined;
  }, [gridState.rendering.renderContext]);

  useEnhancedEffect(() => {
    if (renderingZoneRef && renderingZoneRef.current) {
      logger.debug('applying scrollTop ', gridState.rendering.renderingZoneScroll.top);
      scrollTo(gridState.rendering.renderingZoneScroll);
    }
  });

  const virtualApi: Partial<GridVirtualizationApi> = {
    scroll,
    scrollToIndexes,
    getContainerPropsState,
    getRenderContextState,
    getScrollPosition,
    updateViewport,
  };
  useGridApiMethod(apiRef, virtualApi, 'GridVirtualizationApi');

  React.useEffect(() => {
    if (
      gridState.rendering.renderContext?.paginationCurrentPage !== gridState.pagination.page &&
      apiRef.current.updateViewport
    ) {
      logger.debug(`State pagination.page changed to ${gridState.pagination.page}. `);
      apiRef.current.updateViewport(true);
      resetScroll();
    }
  }, [
    apiRef,
    gridState.pagination.page,
    gridState.rendering.renderContext?.paginationCurrentPage,
    logger,
    resetScroll,
  ]);

  React.useEffect(() => {
    if (
      gridState.containerSizes !== gridState.rendering.renderedSizes &&
      apiRef.current.updateViewport
    ) {
      logger.debug(`gridState.containerSizes updated, updating viewport. `);
      apiRef.current.updateViewport(true);
    }
  }, [apiRef, gridState.containerSizes, gridState.rendering.renderedSizes, logger]);

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

  React.useEffect(() => {
    return () => {
      clearTimeout(scrollingTimeout.current);
    };
  }, []);

  const preventViewportScroll = React.useCallback(
    (event: any) => {
      logger.debug('Using keyboard to navigate cells, converting scroll events ');

      event.target.scrollLeft = 0;
      event.target.scrollTop = 0;
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    [logger],
  );

  useNativeEventListener(apiRef, windowRef, GRID_NATIVE_SCROLL, handleScroll, { passive: true });
  useNativeEventListener(
    apiRef,
    () => renderingZoneRef.current?.parentElement,
    GRID_NATIVE_SCROLL,
    preventViewportScroll,
  );
  useGridApiEventHandler(apiRef, GRID_RESIZE, updateViewport);
};
