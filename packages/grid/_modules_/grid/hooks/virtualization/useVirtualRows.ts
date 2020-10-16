import * as React from 'react';
import { isEqual } from '../../utils/utils';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { PaginationState } from '../features/pagination/paginationReducer';
import { paginationSelector } from '../features/pagination/paginationSelector';
import { rowCountSelector, rowsSelector } from '../features/rows/rowsSelector';
import { columnsTotalWidthSelector } from '../root/columns/columnsSelector';
import { optionsSelector } from '../utils/useOptionsProp';
import { useVirtualColumns } from './useVirtualColumns';
import {
  CellIndexCoordinates,
  ContainerProps,
  GridOptions,
  InternalColumns,
  RenderContextProps,
  RenderRowProps,
  Rows,
  VirtualizationApi,
  ApiRef,
} from '../../models';
import { ScrollParams, useScrollFn } from '../utils';
import { useLogger } from '../utils/useLogger';
import {   useContainerProps } from '../root';
import {
  RESIZE,
  SCROLL,
  SCROLLING,
  SCROLLING_START,
  SCROLLING_STOP,
} from '../../constants/eventsConstants';
import { useApiMethod } from '../root/useApiMethod';
import { useNativeEventListener } from '../root/useNativeEventListener';
import { useApiEventHandler } from '../root/useApiEventHandler';

type UseVirtualRowsReturnType = Partial<RenderContextProps> | null;

// TODO v5: replace with @material-ui/core/utils/useEnhancedEffect.
const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export interface InternalRenderingState {
  virtualPage: number;
  virtualRowsCount: number;
  renderContext: Partial<RenderContextProps> | null;
  realScroll: ScrollParams;
  renderingZoneScroll: ScrollParams;
  renderedSizes: ContainerProps | null;
}

export const getInitialRenderingState = (): InternalRenderingState => {
  return {
    realScroll: {left: 0, top: 0},
    renderContext: null,
    renderingZoneScroll: {left: 0, top: 0},
    virtualPage: 0,
    virtualRowsCount: 0,
    renderedSizes: null
  }
}

export const useVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: ApiRef,
): UseVirtualRowsReturnType => {
  const logger = useLogger('useVirtualRows');

  const [gridState, setGridState, forceUpdate]= useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, paginationSelector);
  const totalRowCount = useGridSelector<number>(apiRef, rowCountSelector);

  const [, scrollColHeaderTo] = useScrollFn(colRef);
  const onDataScroll = (v: ScrollParams) => scrollColHeaderTo({ left: v.left, top: 0 });
  const [scrollTo] = useScrollFn(renderingZoneRef, onDataScroll);

  const [renderedColRef, updateRenderedCols] = useVirtualColumns(options, apiRef);

  const setRenderingState = React.useCallback((state: Partial<InternalRenderingState>)=> {
    let stateChanged = false;
    setGridState((oldState)=> {
      const currentRenderingState = {...oldState.rendering, ...state};
      if(!isEqual(oldState.rendering, currentRenderingState)) {
        oldState.rendering = currentRenderingState;
        stateChanged = true;
      }
      return oldState;
    });
    return stateChanged;
  },[setGridState])

  const getRenderRowProps = React.useCallback(
    (page: number) => {
      if (gridState.containerSizes == null) {
        return null;
      }
      let minRowIdx = 0;
      if (options.pagination && paginationState.pageSize != null) {
        minRowIdx = paginationState.pageSize * (paginationState.page - 1 > 0 ? paginationState.page - 1 : 0);
      }

      const firstRowIdx = page * gridState.containerSizes.viewportPageSize + minRowIdx;
      let lastRowIdx = firstRowIdx + gridState.containerSizes.renderingZonePageSize;
      const maxIndex = gridState.containerSizes.virtualRowsCount + minRowIdx;
      if (lastRowIdx > maxIndex) {
        lastRowIdx = maxIndex;
      }

      const rowProps: RenderRowProps = { page, firstRowIdx, lastRowIdx };
      return rowProps;
    },
    [gridState.containerSizes, options.pagination, paginationState.pageSize, paginationState.page],
  );

  const getRenderingState = React.useCallback((): Partial<RenderContextProps> | null => {
    if (gridState.containerSizes == null) {
      return null;
    }

    const newRenderCtx: Partial<RenderContextProps> = {
      ...renderedColRef.current,
      ...getRenderRowProps(gridState.rendering.virtualPage),
      paginationCurrentPage: paginationState.page,
      pageSize: paginationState.pageSize,
    };
    return newRenderCtx;
  }, [renderedColRef, getRenderRowProps, gridState.rendering, gridState.containerSizes, paginationState.page, paginationState.pageSize]);

  const reRender = React.useCallback(() => {
    const renderingState = getRenderingState();
    const hasChanged = setRenderingState({renderContext: renderingState, renderedSizes: gridState.containerSizes});
    if(hasChanged) {
      forceUpdate();
    }
  }, [forceUpdate, getRenderingState, gridState.containerSizes, setRenderingState]);

  const updateViewport = React.useCallback(() => {
    const containerProps = gridState.containerSizes;

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

      const page = gridState.rendering.virtualPage;
      currentPage = Math.floor(currentPage);

      if (page !== currentPage) {
        setRenderingState({virtualPage: currentPage});

        logger.debug(`Changing page from ${page} to ${currentPage}`);
        requireRerender = true;
      } else {
        scrollTo(scrollParams);
        apiRef.current.publishEvent(SCROLLING, scrollParams);
      }
      setRenderingState({renderingZoneScroll: scrollParams});

      const pageChanged = gridState.rendering.renderContext && gridState.rendering.renderContext.paginationCurrentPage !== paginationState.page;
      if (requireRerender ||  pageChanged) {
        forceUpdate();
        reRender();
      }
    }
  }, [apiRef, forceUpdate, gridState.containerSizes, gridState.rendering.renderContext, gridState.rendering.virtualPage, logger, paginationState.page, reRender, scrollTo, setRenderingState, updateRenderedCols, windowRef]);

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({virtualPage: 1});

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTo(0, 0);
    }
    setRenderingState({renderingZoneScroll: { left: 0, top: 0 }});

  }, [scrollTo, setRenderingState, windowRef]);


  const scrollingTimeout = React.useRef<any>(null);
  const handleScroll = React.useCallback(() => {
    // On iOS the inertia scrolling allows to return negative values.
    if (windowRef.current!.scrollLeft < 0 || windowRef.current!.scrollTop < 0) return;

    setRenderingState({realScroll: {
      left: windowRef.current!.scrollLeft,
      top: windowRef.current!.scrollTop,
    }})
    if (!scrollingTimeout.current) {
        apiRef.current.state.isScrolling = true;
      }
      clearTimeout(scrollingTimeout.current);
      scrollingTimeout.current = setTimeout(() => {
        scrollingTimeout.current = null;
        apiRef.current.state.isScrolling = false;
      }, 300);

      updateViewport();
    },
    [setRenderingState, updateViewport, apiRef],
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

      const currentRowPage = params.rowIndex / gridState.containerSizes!.viewportPageSize;
      const scrollPosition = currentRowPage * gridState.containerSizes!.viewportSize.height;
      const viewportHeight = gridState.containerSizes!.viewportSize.height;

      const isRowIndexAbove = gridState.rendering.realScroll.top > scrollPosition;
      const isRowIndexBelow =
        gridState.rendering.realScroll.top + viewportHeight < scrollPosition + options.rowHeight;

      if (isRowIndexAbove) {
        scrollTop = scrollPosition; // We put it at the top of the page
        logger.debug(`Row is above, setting scrollTop to ${scrollTop}`);
      } else if (isRowIndexBelow) {
        // We make sure the row is not half visible
        scrollTop = scrollPosition - viewportHeight + options.rowHeight;
        logger.debug(`Row is below, setting scrollTop to ${scrollTop}`);
      }

      apiRef.current.scroll({
        left: scrollLeft,
        top: scrollTop,
      });
    },
    [logger, apiRef, gridState.containerSizes, gridState.rendering.realScroll.top, gridState.rendering.renderingZoneScroll.left, options.rowHeight],
  );

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
      updateViewport();
    },
    [windowRef, colRef, updateViewport, logger],
  );

  const getContainerPropsState = React.useCallback(() => gridState.containerSizes, [gridState.containerSizes]);

  const getRenderContextState = React.useCallback(() => {
    return gridState.rendering.renderContext || undefined;
  }, [gridState.rendering.renderContext]);

  useEnhancedEffect(() => {
    if (renderingZoneRef && renderingZoneRef.current) {
      logger.debug('applying scrollTop ', gridState.rendering.renderingZoneScroll.top);
      scrollTo(gridState.rendering.renderingZoneScroll);
    }
  });

  React.useEffect(()=> {
    if (gridState.containerSizes !== gridState.rendering.renderedSizes) {
      updateViewport();
    }
  }, [gridState.containerSizes, gridState.rendering.renderedSizes, logger, updateViewport]);

  React.useEffect(()=> {
    if(gridState.rendering.renderContext?.paginationCurrentPage !== gridState.pagination.page) {
      logger.debug(`State pagination.page changed to ${gridState.pagination.page}. `);
      updateViewport();
      resetScroll();
    }
  }, [gridState.pagination.page, gridState.rendering.renderContext?.paginationCurrentPage, logger, reRender, resetScroll, updateViewport])

  React.useEffect(()=> {
    logger.debug(`totalRowCount has changed to ${totalRowCount}, updating viewport.`);
    updateViewport();
    reRender();

  }, [logger, reRender, totalRowCount, updateViewport]);

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
