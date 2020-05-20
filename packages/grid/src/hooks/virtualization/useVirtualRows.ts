import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useVirtualColumns } from './useVirtualColumns';
import {
  CellIndexCoordinates,
  ContainerProps,
  GridApi,
  GridOptions,
  InternalColumns,
  RenderContextProps,
  RenderRowProps,
  Rows,
  VirtualizationApi,
} from '../../models';
import { ScrollParams, useScrollFn } from '../utils';
import { useLogger } from '../utils/useLogger';
import { useContainerProps } from '../root';
import { GridApiRef } from '../../grid';
import { SCROLLING, SCROLLING_START, SCROLLING_STOP } from '../../constants/eventsConstants';
import { debounce } from '../../utils';

const SCROLL_EVENT = 'scroll';
type UseVirtualRowsReturnType = [Partial<RenderContextProps> | null, () => void];

export const useVirtualRows = (
  colRef: React.MutableRefObject<HTMLDivElement | null>,
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  viewportRef: React.MutableRefObject<HTMLDivElement | null>,
  internalColumns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  apiRef: GridApiRef,
): UseVirtualRowsReturnType => {
  const logger = useLogger('useVirtualRows');
  const pageRef = useRef<number>(0);
  const rowsCount = useRef<number>(0);
  const containerPropsRef = useRef<ContainerProps | null>(null);
  const realScrollRef = useRef<ScrollParams>({ left: 0, top: 0 });
  const rzScrollRef = useRef<ScrollParams>({ left: 0, top: 0 });
  const columnTotalWidthRef = useRef<number>(internalColumns.meta.totalWidth);
  const renderCtxRef = useRef<Partial<RenderContextProps>>();

  const scrollTo = useScrollFn(viewportRef);
  // const scrollColHeaderTo = useScrollFn(colRef);
  const getContainerProps = useContainerProps(windowRef);
  const [renderCtx, setRenderCtx] = useState<Partial<RenderContextProps> | null>(null);
  const [renderedColRef, updateRenderedCols] = useVirtualColumns(options, apiRef);

  const getRenderRowProps = (page: number) => {
    if (containerPropsRef.current == null) {
      return null;
    }
    const containerProps = containerPropsRef.current;
    const firstRowIdx = page * containerProps.windowPageSize;
    let lastRowIdx = firstRowIdx + containerProps.pageSize;
    if (lastRowIdx > rowsCount.current - 1) {
      lastRowIdx = rowsCount.current - 1;
    }
    const rowProps: RenderRowProps = { page, firstRowIdx, lastRowIdx };
    return rowProps;
  };

  const getRenderCtxState = (): Partial<RenderContextProps> | null => {
    const containerProps = containerPropsRef.current;
    const renderedCol = renderedColRef.current;
    const renderedRow = getRenderRowProps(pageRef.current);

    if (containerProps == null) {
      return null;
    }

    const renderCtx: Partial<RenderContextProps> = {
      ...containerProps,
      ...renderedCol,
      ...renderedRow,
    };
    logger.debug(':: getRenderCtxState - returning state ', renderCtx);
    renderCtxRef.current = renderCtx;
    return renderCtx;
  };

  const reRender = () => setRenderCtx(getRenderCtxState());
  const updateViewport = debounce(() => {
    if (windowRef && windowRef.current && containerPropsRef && containerPropsRef.current) {
      const containerProps = containerPropsRef.current;
      const { scrollLeft, scrollTop } = windowRef.current;
      logger.debug(`--- Handling scroll Left: ${scrollLeft} Top: ${scrollTop}`);

      let requireRerender = updateRenderedCols(containerProps, scrollLeft);

      const viewportHeight = containerProps.viewportSize.height;
      const rzScrollLeft = scrollLeft;
      let currentPage = scrollTop / viewportHeight;
      const rzScrollTop = scrollTop % viewportHeight;
      logger.debug(` viewportHeight:${viewportHeight},
      rzScrollTop: ${rzScrollTop},  
      scrollTop: ${scrollTop},  
      current page = ${currentPage}`);

      const scrollParams = { left: rzScrollLeft, top: rzScrollTop };

      const page = pageRef.current;
      currentPage = Math.floor(currentPage);

      if (page !== currentPage) {
        pageRef.current = currentPage;
        logger.debug(`Changing page from ${page} to ${currentPage}`);
        requireRerender = true;
      } else {
        scrollTo(scrollParams);
        colRef.current!.scroll({ ...scrollParams, ...{ top: 0 } });
        apiRef.current!.emit(SCROLLING, scrollParams);
      }
      rzScrollRef.current = scrollParams;

      if (requireRerender) {
        reRender();
      }

      logger.debug('---');
    }
  }, 10);

  useLayoutEffect(() => {
    if (viewportRef && viewportRef.current) {
      logger.debug('applying scrollTop ', rzScrollRef.current);
      scrollTo(rzScrollRef.current);
      // scrollColHeaderTo({ ...rzScrollRef.current, ...{ top: 0 } });
    }
  });

  const resetScroll = () => {
    pageRef.current = 0;

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTo(0, 0);
    }
    rzScrollRef.current = { left: 0, top: 0 };
    scrollTo({ left: 0, top: 0 });
  };

  const updateContainerSize = () => {
    if (columnTotalWidthRef.current > 0) {
      containerPropsRef.current = getContainerProps(options, columnTotalWidthRef.current, rowsCount.current);
      updateViewport();
      reRender();
    } else {
      containerPropsRef.current = null;
    }
  };

  const scrollingTimeout = useRef<any>(0);
  const onScroll: any = (e: any) => {
    realScrollRef.current = { left: e.target.scrollLeft, top: e.target.scrollTop };
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
  };

  const scrollToIndexes = (params: CellIndexCoordinates) => {
    logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);
    //TODO Check if cell already displayed
    //If yes do nothing
    let scrollLeft;
    if (apiRef.current) {
      const isColVisible = apiRef.current.isColumnVisibleInWindow(params.colIndex);
      console.log(`==> Column ${params.colIndex} is ${isColVisible ? 'YES' : 'NOT'} visible!`);
      if (!isColVisible) {
        const meta = apiRef.current.getColumnsMeta();
        scrollLeft = meta.positions[params.colIndex + 1] - containerPropsRef.current!.windowSizes.width;

        const isLastCol = params.colIndex + 1 === meta.positions.length;
        if (isLastCol) {
          const lastColWidth = apiRef.current.getVisibleColumns()[params.colIndex].width!;
          scrollLeft = meta.positions[params.colIndex] + lastColWidth - containerPropsRef.current!.windowSizes.width;
        }
        scrollLeft = rzScrollRef.current.left > scrollLeft ? meta.positions[params.colIndex] : scrollLeft;
      }

      const isRowIndexAbove = realScrollRef.current.top > params.rowIndex * options.rowHeight;  //rzScrollRef.current.top > rowPositionInRenderingZone;
      const isRowIndexBelow = realScrollRef.current.top + containerPropsRef.current!.viewportSize.height < (params.rowIndex + 1) * options.rowHeight;

      console.log(`row height ${options.rowHeight}, row position: ${params.rowIndex * options.rowHeight}  realScroll.top ${realScrollRef.current.top}
window H: ${containerPropsRef.current!.viewportSize.height}, above: ${isRowIndexAbove} or below: ${isRowIndexBelow} `);

      let scrollTop;

      if(isRowIndexBelow) {
        scrollTop = (params.rowIndex + 1) * options.rowHeight
          - containerPropsRef.current!.viewportSize.height
        console.log(`Setting scrollTop to ${scrollTop}`);

      }
   else if(isRowIndexAbove) {
        scrollTop = (params.rowIndex) * options.rowHeight;
        console.log(`Setting scrollTop to ${scrollTop}`);

      }

      apiRef.current.scroll({
        left: scrollLeft,
        top: scrollTop
      });
      // const rowPosition = params.rowIndex * options.rowHeight;
      // const isRowVisible  = renderCtxRef.current.firstRowIdx>=
    }
  };

  const scroll = (params: Partial<ScrollParams>) => {
    logger.debug(`Scrolling to left: ${params.left} top: ${params.top}`);
    if (windowRef.current && params.left != null && colRef.current) {
      colRef.current.scrollLeft = params.left;
      windowRef.current.scrollLeft = params.left;
    }
    if (windowRef.current && params.top != null) {
      windowRef.current.scrollTop = params.top;
    }
    updateViewport();
  };

  useEffect(() => {
    columnTotalWidthRef.current = internalColumns.meta.totalWidth;
    updateContainerSize();

    if (windowRef && windowRef.current) {
      logger.debug('Binding scroll event to window.');
      const options = { passive: true };
      windowRef.current.addEventListener(SCROLL_EVENT, onScroll, options);
      return () => {
        logger.debug('Unbinding scroll event to window.');
        windowRef.current!.removeEventListener(SCROLL_EVENT, onScroll);
      };
    }
  }, [internalColumns]);

  useEffect(() => {
    logger.debug('+++ options or viewportRef changed ');
    resetScroll();
    updateContainerSize();
  }, [options, viewportRef]);

  const onViewportScroll = (e: any) => {
    logger.debug('Using keyboard to navigate cells, converting scroll events ');
    const { scrollLeft, scrollTop } = e.target;
    // scroll({ left: scrollLeft, top: scrollTop });
    e.target.scrollLeft = 0;
    e.target.scrollTop = 0;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    if (rows.length !== rowsCount.current) {
      logger.debug('Row length changed to ', rows.length);
      rowsCount.current = rows.length;
      updateContainerSize();
    }
    if (viewportRef && viewportRef.current) {
      viewportRef.current.parentElement?.addEventListener(SCROLL_EVENT, onViewportScroll);
      return () => {
        viewportRef.current?.parentElement?.removeEventListener(SCROLL_EVENT, onViewportScroll);
      };
    }
  }, [rows]);

  const onResize = () => {
    logger.debug('+++ onResize ');
    updateContainerSize();
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding scroll api to apiRef');

      const virtualApi: Partial<VirtualizationApi> = {
        scroll,
        scrollToIndexes,
      };

      apiRef.current = Object.assign(apiRef.current, virtualApi) as GridApi;
    }
  }, [apiRef]);

  return [renderCtx, onResize];
};
