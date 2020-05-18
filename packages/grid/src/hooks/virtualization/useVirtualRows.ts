import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useVirtualColumns } from './useVirtualColumns';
import {
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
  const rzScrollRef = useRef<ScrollParams>({ left: 0, top: 0 });
  const columnTotalWidthRef = useRef<number>(internalColumns.meta.totalWidth);

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

    return renderCtx;
  };

  const reRender = () => setRenderCtx(getRenderCtxState());
  const updateViewport = debounce(() => {
    if (windowRef && windowRef.current && containerPropsRef && containerPropsRef.current) {
      const containerProps = containerPropsRef.current;
      const { scrollLeft, scrollTop } = windowRef.current;
      logger.debug(`scrolling Left: ${scrollLeft} Top: ${scrollTop}`);

      const rzHeight = containerProps.renderingZone.height;
      const rzWidth = containerProps.renderingZone.width;
      const windowHeight = containerProps.windowSizes.height;
      const windowWidth = containerProps.windowSizes.width;
      const maxScrollTop = rzHeight - windowHeight + containerProps.scrollBarSize!; //629
      const maxScrollLeft = rzWidth - windowWidth + containerProps.scrollBarSize!; //629

      const rowViewportScrollTop = scrollTop; // columns height
      const rowViewportScrollLeft = scrollLeft; // columns height
      logger.debug('scrollTop: ', scrollTop);
      let rzScrollTop = rowViewportScrollTop % maxScrollTop;
      logger.debug('First calc rzScrollTop: ', rzScrollTop);
      const rzScrollLeft = rowViewportScrollLeft; // % maxScrollLeft;
      logger.debug(
        `rzH: ${rzHeight} winH: ${windowHeight}, maxScrollTop: ${maxScrollTop}, maxScrollLeft: ${maxScrollLeft}`,
      );
      logger.debug(`rzScrollLeft: ${rzScrollLeft} `);
      let requireRerender = updateRenderedCols(containerProps, scrollLeft);

      const scrollParams = { left: rzScrollLeft, top: rzScrollTop };
      let currentPage = Math.floor(rowViewportScrollTop / maxScrollTop);

      let freezeScrollTop = false;
      if (currentPage > containerProps.lastPage!) {
        scrollParams.top = maxScrollTop;
        freezeScrollTop = true;
        logger.debug(`not scrolling to rzScrollTop: ${rzScrollTop}, scrolling to max ${maxScrollTop}`);

        //HACK to fix issue on the last page, totalHeight needs to resize to avoid blank scroll page
        const newTotalHeight = rowViewportScrollTop - rzScrollTop + maxScrollTop;
        logger.debug(`Patching height to `, newTotalHeight);
        containerPropsRef.current.totalHeight = newTotalHeight;
        requireRerender = true;
      } else if (currentPage < containerProps.lastPage!) {
        //HACK to restore the fix above.
        const oldTotalHeight = (containerProps.lastPage + 2) * (containerProps.renderingZone.height / 2);
        logger.debug(`Patching back height to `, oldTotalHeight);
        if (oldTotalHeight !== containerPropsRef.current.totalHeight) {
          containerPropsRef.current.totalHeight = oldTotalHeight;
          requireRerender = true;
        }
      }
      const page = pageRef.current;
      currentPage = currentPage > containerProps.lastPage! ? containerProps.lastPage! : currentPage;
      logger.debug(`state pageNumber ${page}, current is ${currentPage}`);

      if (page !== currentPage) {
        if (page < currentPage && !freezeScrollTop) {
          rzScrollTop = rzScrollTop <= maxScrollTop ? 0 : rzScrollTop % maxScrollTop;
          scrollParams.top = rzScrollTop;
          logger.debug('Resetting rzScrollTop  to', rzScrollTop);
        }

        pageRef.current = currentPage;
        requireRerender = true;
      } else {
        scrollTo(scrollParams);
        // scrollColHeaderTo({ ...scrollParams, ...{ top: 0 } });
        colRef.current!.scroll({ ...scrollParams, ...{ top: 0 } });
        apiRef.current!.emit(SCROLLING, scrollParams);
      }
      rzScrollRef.current = scrollParams;

      if (requireRerender) {
        reRender();
      }

      logger.debug(`rzScrollTop: ${rzScrollTop} `); //Viewport SC: ${viewportRef.current?.scrollTop}
      logger.debug('------------');
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
  const onScroll: any = () => {
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
  const scroll = (params: Partial<ScrollParams>) => {
    logger.debug(`Scrolling to left: ${params.left} top: ${params.top}`);
    if (windowRef.current && params.left) {
      windowRef.current.scrollLeft = params.left;
    }
    if (windowRef.current && params.top) {
      windowRef.current.scrollTop = params.top;
    }
    updateViewport();
  };

  useEffect(() => {
    columnTotalWidthRef.current = internalColumns.meta.totalWidth;
    updateContainerSize();

    if (windowRef && windowRef.current) {
      logger.debug('Binding scroll event to window.');
      const options = {passive: true}
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

  useEffect(() => {
    if (rows.length !== rowsCount.current) {
      logger.debug('Row length changed to ', rows.length);
      rowsCount.current = rows.length;
      updateContainerSize();
    }
  }, [rows]);

  const onResize = () => {
    logger.debug('+++ onResize ');
    updateContainerSize();
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding scroll api to apiRef');

      const virtualApi: VirtualizationApi = {
        scroll,
      };

      apiRef.current = Object.assign(apiRef.current, virtualApi) as GridApi;
    }
  }, [apiRef]);

  return [renderCtx, onResize];
};
