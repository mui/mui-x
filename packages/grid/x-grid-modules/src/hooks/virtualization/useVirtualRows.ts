import * as React from 'react';
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
import { useContainerProps } from '../root';
import {
  RESIZE,
  SCROLLING,
  SCROLLING_START,
  SCROLLING_STOP,
} from '../../constants/eventsConstants';
import { useApiMethod } from '../root/useApiMethod';
import { useNativeEventListener } from '../root/useNativeEventListener';
import { useApiEventHandler } from '../root/useApiEventHandler';

const SCROLL_EVENT = 'scroll';
type UseVirtualRowsReturnType = Partial<RenderContextProps> | null;

export const useVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>,
  internalColumns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  apiRef: ApiRef,
): UseVirtualRowsReturnType => {
  const logger = useLogger('useVirtualRows');
  const pageRef = React.useRef<number>(0);
  const rowsCount = React.useRef<number>(rows.length);
  const paginationCurrentPage = React.useRef<number>(1);
  const containerPropsRef = React.useRef<ContainerProps | null>(null);
  const optionsRef = React.useRef<GridOptions>(options);
  const realScrollRef = React.useRef<ScrollParams>({ left: 0, top: 0 });
  const rzScrollRef = React.useRef<ScrollParams>({ left: 0, top: 0 });
  const columnTotalWidthRef = React.useRef<number>(internalColumns.meta.totalWidth);
  const renderCtxRef = React.useRef<Partial<RenderContextProps>>();

  const [, scrollColHeaderTo] = useScrollFn(colRef);
  const onDataScroll = (v: ScrollParams) => scrollColHeaderTo({ left: v.left, top: 0 });
  const [scrollTo] = useScrollFn(renderingZoneRef, onDataScroll);

  const getContainerProps = useContainerProps(windowRef);
  const [renderCtx, setRenderCtx] = React.useState<Partial<RenderContextProps> | null>(null);
  const [renderedColRef, updateRenderedCols] = useVirtualColumns(options, apiRef);

  const getRenderRowProps = React.useCallback(
    (page: number) => {
      if (containerPropsRef.current == null) {
        return null;
      }
      const containerProps = containerPropsRef.current!;
      let minRowIdx = 0;
      if (optionsRef.current.pagination && optionsRef.current.pageSize != null) {
        minRowIdx =
          optionsRef.current.pageSize *
          (paginationCurrentPage.current - 1 > 0 ? paginationCurrentPage.current - 1 : 0);
      }

      const firstRowIdx = page * containerProps.viewportPageSize + minRowIdx;
      let lastRowIdx = firstRowIdx + containerProps.renderingZonePageSize;
      const maxIndex = rowsCount.current + minRowIdx;
      if (lastRowIdx > maxIndex) {
        lastRowIdx = maxIndex;
      }

      const rowProps: RenderRowProps = { page, firstRowIdx, lastRowIdx };
      return rowProps;
    },
    [containerPropsRef],
  );

  const getRenderCtxState = React.useCallback((): Partial<RenderContextProps> | null => {
    const containerProps = containerPropsRef.current;
    const renderedCol = renderedColRef.current;
    const renderedRow = getRenderRowProps(pageRef.current);

    if (containerProps == null) {
      return null;
    }

    const newRenderCtx: Partial<RenderContextProps> = {
      ...containerProps,
      ...renderedCol,
      ...renderedRow,
      ...{
        paginationCurrentPage: paginationCurrentPage.current,
        pageSize: optionsRef.current.pageSize,
      },
    };
    logger.debug(':: getRenderCtxState - returning state ', newRenderCtx);
    renderCtxRef.current = newRenderCtx;
    return newRenderCtx;
  }, [logger, renderCtxRef, containerPropsRef, renderedColRef, getRenderRowProps]);

  const reRender = React.useCallback(() => setRenderCtx(getRenderCtxState()), [
    getRenderCtxState,
    setRenderCtx,
  ]);
  const updateViewport = React.useCallback(() => {
    if (windowRef && windowRef.current && containerPropsRef && containerPropsRef.current) {
      const containerProps = containerPropsRef.current;
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

      const page = pageRef.current;
      currentPage = Math.floor(currentPage);

      if (page !== currentPage) {
        pageRef.current = currentPage;
        logger.debug(`Changing page from ${page} to ${currentPage}`);
        requireRerender = true;
      } else {
        scrollTo(scrollParams);
        apiRef.current!.emit(SCROLLING, scrollParams);
      }
      rzScrollRef.current = scrollParams;

      if (
        requireRerender ||
        (renderCtxRef.current &&
          renderCtxRef.current.paginationCurrentPage !== paginationCurrentPage.current)
      ) {
        reRender();
      }
    }
  }, [apiRef, logger, reRender, windowRef, updateRenderedCols, scrollTo]);

  React.useLayoutEffect(() => {
    if (renderingZoneRef && renderingZoneRef.current) {
      logger.debug('applying scrollTop ', rzScrollRef.current);
      scrollTo(rzScrollRef.current);
    }
  });

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    pageRef.current = 1;

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTo(0, 0);
    }
    rzScrollRef.current = { left: 0, top: 0 };
  }, [windowRef, rzScrollRef, pageRef, scrollTo]);

  const updateContainerSize = React.useCallback(() => {
    if (columnTotalWidthRef.current > 0) {
      const totalRowsCount = apiRef?.current?.getRowsCount() || 0; // we ensure we call with latest length
      const currentPage = paginationCurrentPage.current;
      let pageRowCount =
        optionsRef.current.pagination && optionsRef.current.pageSize
          ? optionsRef.current.pageSize
          : null;

      pageRowCount =
        !pageRowCount || currentPage * pageRowCount <= totalRowsCount
          ? pageRowCount
          : totalRowsCount - (currentPage - 1) * pageRowCount;

      rowsCount.current =
        pageRowCount == null || pageRowCount > totalRowsCount ? totalRowsCount : pageRowCount;
      containerPropsRef.current = getContainerProps(
        optionsRef.current,
        columnTotalWidthRef.current,
        rowsCount.current,
      );
      if (optionsRef.current.autoPageSize && containerPropsRef.current) {
        rowsCount.current = containerPropsRef.current.viewportPageSize;
      }
      updateViewport();
      reRender();
    } else {
      containerPropsRef.current = null;
    }
  }, [containerPropsRef, apiRef, getContainerProps, reRender, updateViewport]);

  const scrollingTimeout = React.useRef<any>(0);
  const onScroll: any = React.useCallback(
    (event: any) => {
      realScrollRef.current = { left: event.target.scrollLeft, top: event.target.scrollTop };
      if (apiRef && apiRef.current && scrollingTimeout.current === 0) {
        apiRef.current.emit(SCROLLING_START);
      }
      clearTimeout(scrollingTimeout.current);
      scrollingTimeout.current = setTimeout(() => {
        scrollingTimeout.current = 0;
        if (apiRef && apiRef.current) {
          apiRef.current.emit(SCROLLING_STOP);
        }
      }, 300);
      updateViewport();
    },
    [apiRef, updateViewport, scrollingTimeout, realScrollRef],
  );

  const scrollToIndexes = React.useCallback(
    (params: CellIndexCoordinates) => {
      logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);

      if (apiRef.current) {
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
              containerPropsRef.current!.windowSizes.width;
          } else {
            scrollLeft =
              meta.positions[params.colIndex + 1] - containerPropsRef.current!.windowSizes.width;
          }
          scrollLeft =
            rzScrollRef.current.left > scrollLeft ? meta.positions[params.colIndex] : scrollLeft;
        }

        let scrollTop;

        const currentRowPage = params.rowIndex / containerPropsRef.current!.viewportPageSize;
        const scrollPosition = currentRowPage * containerPropsRef.current!.viewportSize.height;
        const viewportHeight = containerPropsRef.current!.viewportSize.height;

        const isRowIndexAbove = realScrollRef.current.top > scrollPosition;
        const isRowIndexBelow =
          realScrollRef.current.top + viewportHeight <
          scrollPosition + optionsRef.current.rowHeight;

        if (isRowIndexAbove) {
          scrollTop = scrollPosition; // We put it at the top of the page
          logger.debug(`Row is above, setting scrollTop to ${scrollTop}`);
        } else if (isRowIndexBelow) {
          // We make sure the row is not half visible
          scrollTop = scrollPosition - viewportHeight + optionsRef.current.rowHeight;
          logger.debug(`Row is below, setting scrollTop to ${scrollTop}`);
        }

        apiRef.current.scroll({
          left: scrollLeft,
          top: scrollTop,
        });
      }
    },
    [apiRef, realScrollRef, logger],
  );

  const scroll = React.useCallback(
    (params: Partial<ScrollParams>) => {
      logger.debug(`Scrolling to left: ${params.left} top: ${params.top}`);
      if (windowRef.current && params.left != null && colRef.current) {
        colRef.current.scrollLeft = params.left;
        windowRef.current.scrollLeft = params.left;
      }
      if (windowRef.current && params.top != null) {
        windowRef.current.scrollTop = params.top;
      }
      updateViewport();
    },
    [logger, windowRef, updateViewport, colRef],
  );

  const getContainerPropsState = React.useCallback(() => {
    if (!containerPropsRef.current) {
      updateContainerSize();
    }
    return containerPropsRef.current;
  }, [updateContainerSize]);

  const getRenderContextState = React.useCallback(() => {
    return renderCtxRef.current;
  }, []);

  const renderPage = React.useCallback(
    (page: number) => {
      paginationCurrentPage.current = page;
      resetScroll();
      updateContainerSize();
    },
    [paginationCurrentPage, resetScroll, updateContainerSize],
  );
  const onResize = React.useCallback(() => {
    logger.debug('OnResize, recalculating container sizes.');
    updateContainerSize();
  }, [logger, updateContainerSize]);

  const onViewportScroll = React.useCallback(
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

  useApiEventHandler(apiRef, RESIZE, onResize);
  useNativeEventListener(apiRef, windowRef, SCROLL_EVENT, onScroll, { passive: true });
  useNativeEventListener(
    apiRef,
    () => renderingZoneRef.current?.parentElement,
    SCROLL_EVENT,
    onViewportScroll,
  );

  React.useEffect(() => {
    if (columnTotalWidthRef.current !== internalColumns.meta.totalWidth) {
      columnTotalWidthRef.current = internalColumns.meta.totalWidth;
      updateContainerSize();
    }
  }, [internalColumns, updateContainerSize]);

  React.useEffect(() => {
    if (optionsRef.current !== options) {
      logger.debug('Options change, updating container sizes');
      optionsRef.current = options;
      updateContainerSize();
    }
  }, [options, renderingZoneRef, resetScroll, updateContainerSize, logger]);

  React.useEffect(() => {
    if (rows.length !== rowsCount.current) {
      logger.debug('Row length change to ', rows.length);
      updateContainerSize();
    }
  }, [rows.length, logger, updateContainerSize]);

  const virtualApi: Partial<VirtualizationApi> = {
    scroll,
    scrollToIndexes,
    getContainerPropsState,
    getRenderContextState,
    renderPage,
  };

  useApiMethod(apiRef, virtualApi, 'VirtualizationApi');

  return renderCtx;
};
