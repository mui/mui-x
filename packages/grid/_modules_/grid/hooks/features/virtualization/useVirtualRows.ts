import * as React from 'react';
import { RESIZE, SCROLL, SCROLLING } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { VirtualizationApi } from '../../../models/api/virtualizationApi';
import { RenderContextProps, RenderRowProps } from '../../../models/renderContextProps';
import { CellIndexCoordinates } from '../../../models/rows';
import { isEqual } from '../../../utils/utils';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { PaginationState } from '../pagination/paginationReducer';
import { paginationSelector } from '../pagination/paginationSelector';
import { rowCountSelector } from '../rows/rowsSelector';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { ScrollParams, useScrollFn } from '../../utils/useScrollFn';
import { InternalRenderingState } from './renderingState';
import { useVirtualColumns } from './useVirtualColumns';

type UseVirtualRowsReturnType = Partial<RenderContextProps> | null;

// TODO v5: replace with @material-ui/core/utils/useEnhancedEffect.
const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const useVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: ApiRef,
): UseVirtualRowsReturnType => {
  const logger = useLogger('useVirtualRows');

  const updateViewportRef = React.useRef<(...args: any[]) => void>();
  const [, forceUpdate] = React.useState();
  const [gridState, setGridState, rafUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, paginationSelector);
  const totalRowCount = useGridSelector<number>(apiRef, rowCountSelector);

  const [, scrollColHeaderTo] = useScrollFn(colRef);
  const onDataScroll = (scrollParams: ScrollParams) => {
    scrollColHeaderTo({ left: scrollParams.left, top: 0 });
  };
  const [scrollTo] = useScrollFn(renderingZoneRef, onDataScroll);

  const [renderedColRef, updateRenderedCols] = useVirtualColumns(options, apiRef);

  const setRenderingState = React.useCallback(
    (state: Partial<InternalRenderingState>) => {
      let stateChanged = false;
      setGridState((oldState) => {
        const currentRenderingState = { ...oldState.rendering, ...state };
        if (!isEqual(oldState.rendering, currentRenderingState)) {
          oldState.rendering = currentRenderingState;
          stateChanged = true;
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
      if (options.pagination && paginationState.pageSize != null) {
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
    [apiRef, options.pagination, paginationState.pageSize, paginationState.page],
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
      logger.debug('Force rendering');
      if (apiRef.current.state.isScrolling) {
        rafUpdate();
      } else {
        // we force this update, the func makes react force run this state update and rerender
        forceUpdate((p) => !p);
      }
    }
  }, [apiRef, getRenderingState, logger, rafUpdate, setRenderingState]);

  const updateViewport = React.useCallback(
    (forceReRender = false) => {
      const containerProps = apiRef.current.state.containerSizes;

      if (windowRef && windowRef.current && containerProps) {
        const { scrollLeft, scrollTop } = windowRef.current;
        logger.debug(`Handling scroll Left: ${scrollLeft} Top: ${scrollTop}`);

        let requireRerender = updateRenderedCols(containerProps, scrollLeft);

        const viewportHeight = containerProps.viewportSize.height;
        const rzScrollLeft = scrollLeft;
        let currentPage = scrollTop / viewportHeight;
        const rzScrollTop = scrollTop % viewportHeight;
        logger.debug(
          ` viewportHeight:${viewportHeight}, rzScrollTop: ${rzScrollTop}, scrollTop: ${scrollTop}, current page = ${currentPage}`,
        );

        const scrollParams = {
          left: containerProps?.hasScrollX ? rzScrollLeft : 0,
          top: containerProps?.hasScrollY ? rzScrollTop : 0,
        };

        const page = apiRef.current.state.rendering.virtualPage;
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
          apiRef.current.state.rendering.renderContext &&
          apiRef.current.state.rendering.renderContext.paginationCurrentPage !==
            paginationState.page;
        if (forceReRender || requireRerender || pageChanged) {
          reRender();
        }
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
        const meta = apiRef.current.getColumnsMeta();
        const isLastCol = params.colIndex + 1 === meta.positions.length;

        if (isLastCol) {
          const lastColWidth = apiRef.current.getVisibleColumns()[params.colIndex].width!;
          scrollLeft =
            meta.positions[params.colIndex] +
            lastColWidth -
            gridState.containerSizes!.windowSizes.width;
        } else {
          scrollLeft =
            meta.positions[params.colIndex + 1] -
            gridState.containerSizes!.windowSizes.width +
            (gridState.containerSizes!.hasScrollY ? gridState.containerSizes!.scrollBarSize : 0);
          logger.debug(`Scrolling to the right, scrollLeft: ${scrollLeft}`);
        }
        if (gridState.rendering.renderingZoneScroll.left > scrollLeft) {
          scrollLeft = meta.positions[params.colIndex];
          logger.debug(`Scrolling to the left, scrollLeft: ${scrollLeft}`);
        }
      }

      let scrollTop;

      const currentRowPage =
        (params.rowIndex - (gridState.pagination.page - 1) * gridState.pagination.pageSize) /
        gridState.containerSizes!.viewportPageSize;
      const scrollPosition = currentRowPage * gridState.containerSizes!.viewportSize.height;
      const viewportHeight = gridState.containerSizes!.viewportSize.height;

      const isRowIndexAbove = windowRef.current!.scrollTop > scrollPosition;
      const isRowIndexBelow =
        windowRef.current!.scrollTop + viewportHeight < scrollPosition + options.rowHeight;

      if (isRowIndexAbove) {
        scrollTop = scrollPosition; // We put it at the top of the page
        logger.debug(`Row is above, setting scrollTop to ${scrollTop}`);
      } else if (isRowIndexBelow) {
        // We make sure the row is not half visible
        scrollTop = scrollPosition - viewportHeight + options.rowHeight;
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
      logger,
      apiRef,
      gridState.pagination.page,
      gridState.pagination.pageSize,
      gridState.containerSizes,
      gridState.rendering.renderingZoneScroll.left,
      windowRef,
      options.rowHeight,
    ],
  );

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({ virtualPage: 1 });

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTo(0, 0);
    }
    setRenderingState({ renderingZoneScroll: { left: 0, top: 0 } });
  }, [scrollTo, setRenderingState, windowRef]);

  React.useEffect(() => {
    updateViewportRef.current = updateViewport;
  }, [updateViewport]);

  const scrollingTimeout = React.useRef<any>(null);
  const handleScroll = React.useCallback(() => {
    // On iOS the inertia scrolling allows to return negative values.
    if (windowRef.current!.scrollLeft < 0 || windowRef.current!.scrollTop < 0) return;

    if (!scrollingTimeout.current) {
      apiRef.current.state.isScrolling = true;
    }
    clearTimeout(scrollingTimeout.current);
    scrollingTimeout.current = setTimeout(() => {
      scrollingTimeout.current = null;
      apiRef.current.state.isScrolling = false;
      // We let react decide to run this update.
      forceUpdate(true);
    }, 300);

    if (updateViewportRef.current) {
      updateViewportRef.current();
    }
  }, [windowRef, apiRef, forceUpdate]);

  React.useEffect(() => {
    return () => {
      clearTimeout(scrollingTimeout.current);
    };
  }, []);

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

  React.useEffect(() => {
    if (
      gridState.containerSizes !== gridState.rendering.renderedSizes &&
      updateViewportRef.current
    ) {
      logger.debug(`gridState.containerSizes updated, updating viewport. `);
      updateViewportRef.current(true);
    }
  }, [gridState.containerSizes, gridState.rendering.renderedSizes, logger]);

  React.useEffect(() => {
    if (
      gridState.rendering.renderContext?.paginationCurrentPage !== gridState.pagination.page &&
      updateViewportRef.current
    ) {
      logger.debug(`State pagination.page changed to ${gridState.pagination.page}. `);
      updateViewportRef.current(true);
      resetScroll();
    }
  }, [
    gridState.pagination.page,
    gridState.rendering.renderContext?.paginationCurrentPage,
    logger,
    resetScroll,
  ]);

  React.useEffect(() => {
    if (updateViewportRef.current) {
      logger.debug(`totalRowCount has changed to ${totalRowCount}, updating viewport.`);
      updateViewportRef.current(true);
    }
  }, [logger, totalRowCount]);

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

  const virtualApi: Partial<VirtualizationApi> = {
    scroll,
    scrollToIndexes,
    getContainerPropsState,
    getRenderContextState,
  };

  useApiMethod(apiRef, virtualApi, 'VirtualizationApi');

  useApiEventHandler(apiRef, RESIZE, updateViewport);

  return gridState.rendering.renderContext;
};
