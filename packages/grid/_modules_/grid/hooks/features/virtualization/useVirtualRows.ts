import * as React from 'react';
import { RESIZE, SCROLL, SCROLLING } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { VirtualizationApi } from '../../../models/api/virtualizationApi';
import { CellIndexCoordinates } from '../../../models/cell';
import { ScrollParams } from '../../../models/params/scrollParams';
import { RenderContextProps, RenderRowProps } from '../../../models/renderContextProps';
import { isEqual } from '../../../utils/utils';
import { useEnhancedEffect } from '../../../utils/material-ui-utils';
import { optionsSelector } from '../../utils/optionsSelector';
import { columnsMetaSelector, visibleColumnsSelector } from '../columns/columnsSelector';
import { GridState } from '../core/gridState';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { PaginationState } from '../pagination/paginationReducer';
import { paginationSelector } from '../pagination/paginationSelector';
import { rowCountSelector } from '../rows/rowsSelector';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { useLogger } from '../../utils/useLogger';
import { useScrollFn } from '../../utils/useScrollFn';
import { InternalRenderingState } from './renderingState';
import { useVirtualColumns } from './useVirtualColumns';
import { densityRowHeightSelector } from '../density/densitySelector';

export const useVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: ApiRef,
): void => {
  const logger = useLogger('useVirtualRows');

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, densityRowHeightSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, paginationSelector);
  const totalRowCount = useGridSelector<number>(apiRef, rowCountSelector);
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, columnsMetaSelector);

  const [scrollTo] = useScrollFn(renderingZoneRef, colRef);
  const [renderedColRef, updateRenderedCols] = useVirtualColumns(options, apiRef);

  const setRenderingState = React.useCallback(
    (state: Partial<InternalRenderingState>) => {
      let stateChanged = false;
      setGridState((oldState) => {
        const currentRenderingState = { ...oldState.rendering, ...state };
        if (!isEqual(oldState.rendering, currentRenderingState)) {
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
        minRowIdx =
          paginationState.pageSize * (paginationState.page - 1 > 0 ? paginationState.page - 1 : 0);
      }

      const firstRowIdx = page * apiRef.current.state.containerSizes.viewportPageSize + minRowIdx;
      let lastRowIdx = firstRowIdx + apiRef.current.state.containerSizes.renderingZonePageSize;
      const maxIndex = apiRef.current.state.containerSizes.virtualRowsCount + minRowIdx;
      if (lastRowIdx > maxIndex) {
        lastRowIdx = maxIndex;
      }

      const rowProps: RenderRowProps = { page, firstRowIdx, lastRowIdx };
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

  const getRenderingState = React.useCallback((): Partial<RenderContextProps> | null => {
    if (apiRef.current.state.containerSizes == null) {
      return null;
    }

    const newRenderCtx: Partial<RenderContextProps> = {
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
      const lastState = apiRef.current.getState<GridState>();
      const containerProps = lastState.containerSizes;
      if (!windowRef || !windowRef.current || !containerProps) {
        return;
      }
      const viewportSizes = lastState.viewportSizes;
      const scrollBar = lastState.scrollBar;

      const { scrollLeft, scrollTop } = windowRef.current;
      logger.debug(`Handling scroll Left: ${scrollLeft} Top: ${scrollTop}`);

      let requireRerender = updateRenderedCols(containerProps, scrollLeft);

      const rzScrollLeft = scrollLeft;
      let currentPage = scrollTop / viewportSizes.height;
      const rzScrollTop = scrollTop % viewportSizes.height;
      logger.debug(
        ` viewportHeight:${viewportSizes.height}, rzScrollTop: ${rzScrollTop}, scrollTop: ${scrollTop}, current page = ${currentPage}`,
      );

      const scrollParams = {
        left: scrollBar.hasScrollX ? rzScrollLeft : 0,
        top: scrollBar.hasScrollY ? rzScrollTop : 0,
      };

      const page = lastState.rendering.virtualPage;
      currentPage = Math.floor(currentPage);

      if (page !== currentPage) {
        setRenderingState({ virtualPage: currentPage });

        logger.debug(`Changing page from ${page} to ${currentPage}`);
        requireRerender = true;
      } else {
        scrollTo(scrollParams);
        apiRef.current.publishEvent(SCROLLING, scrollParams);
      }
      setRenderingState({ renderingZoneScroll: scrollParams });

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
    (params: CellIndexCoordinates) => {
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
        (params.rowIndex - (gridState.pagination.page - 1) * gridState.pagination.pageSize) /
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
    [logger, apiRef, gridState, windowRef, rowHeight, columnsMeta.positions, visibleColumns],
  );

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({ virtualPage: 1 });

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
    (params: Partial<ScrollParams>) => {
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

  const virtualApi: Partial<VirtualizationApi> = {
    scroll,
    scrollToIndexes,
    getContainerPropsState,
    getRenderContextState,
    updateViewport,
  };
  useApiMethod(apiRef, virtualApi, 'VirtualizationApi');

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

  useNativeEventListener(apiRef, windowRef, SCROLL, handleScroll, { passive: true });
  useNativeEventListener(
    apiRef,
    () => renderingZoneRef.current?.parentElement,
    SCROLL,
    preventViewportScroll,
  );
  useApiEventHandler(apiRef, RESIZE, updateViewport);
};
