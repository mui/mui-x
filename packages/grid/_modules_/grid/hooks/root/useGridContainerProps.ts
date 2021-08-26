import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { GridApiRef } from '../../models/api/gridApiRef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../models/gridContainerProps';
import { ElementSize } from '../../models/elementSize';
import { isDeepEqual } from '../../utils/utils';
import { gridColumnsTotalWidthSelector } from '../features/columns/gridColumnsSelector';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { gridDensityRowHeightSelector } from '../features/density/densitySelector';
import { visibleGridRowCountSelector } from '../features/filter/gridFilterSelector';
import { gridPaginationSelector } from '../features/pagination/gridPaginationSelector';
import { useLogger } from '../utils/useLogger';
import { useGridApiEventHandler } from './useGridApiEventHandler';
import { GridComponentProps } from '../../GridComponentProps';

function getScrollbarSize(doc: Document, element: HTMLElement): number {
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.className = 'scrollDiv';
  element.appendChild(scrollDiv);
  const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  element.removeChild(scrollDiv);

  return scrollbarSize;
}

export const useGridContainerProps = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'pagination' | 'autoPageSize' | 'pageSize' | 'autoHeight' | 'hideFooter' | 'scrollbarSize'
  >,
) => {
  const logger = useLogger('useGridContainerProps');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const visibleRowsCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const windowRef = apiRef.current.windowRef;

  const rootElement = apiRef.current?.rootElementRef?.current;
  const hasColumns = !!columnsTotalWidth;
  const scrollbarSize = React.useMemo(() => {
    if (props.scrollbarSize != null) {
      return props.scrollbarSize;
    }

    if (!hasColumns || !rootElement) {
      return 0;
    }

    const doc = ownerDocument(rootElement);
    const detectedScrollbarSize = getScrollbarSize(doc, rootElement);
    logger.debug(`Detected scroll bar size ${detectedScrollbarSize}.`);

    return detectedScrollbarSize;
  }, [rootElement, logger, props.scrollbarSize, hasColumns]);

  const getVirtualRowCount = React.useCallback(() => {
    logger.debug('Calculating virtual row count.');
    if (props.pagination && (!props.autoPageSize || props.pageSize)) {
      const rowsLeft = visibleRowsCount - paginationState.page * paginationState.pageSize;
      return rowsLeft > paginationState.pageSize ? paginationState.pageSize : rowsLeft;
    }
    return visibleRowsCount;
  }, [
    logger,
    props.autoPageSize,
    props.pagination,
    props.pageSize,
    paginationState.page,
    paginationState.pageSize,
    visibleRowsCount,
  ]);

  const getScrollBar = React.useCallback(
    (rowsCount: number, windowSizes: ElementSize): GridScrollBarState => {
      logger.debug('Calculating scrollbar sizes.');

      let hasScrollX = columnsTotalWidth > windowSizes.width;
      const scrollBarsSizes = {
        y: 0,
        x: hasScrollX ? scrollbarSize : 0,
      };

      if (rowsCount === 0) {
        return { hasScrollX, hasScrollY: false, sizes: scrollBarsSizes };
      }

      const requiredSize = rowsCount * rowHeight;

      const hasScrollY =
        !props.autoPageSize &&
        !props.autoHeight &&
        requiredSize + scrollBarsSizes.x > windowSizes.height;

      scrollBarsSizes.y = hasScrollY ? scrollbarSize : 0;

      // We recalculate the scroll x to consider the size of the y scrollbar.
      hasScrollX = columnsTotalWidth + scrollBarsSizes.y > windowSizes.width;
      scrollBarsSizes.x = hasScrollX ? scrollbarSize : 0;

      logger.debug(`Scrollbar size on axis x: ${scrollBarsSizes.x}, y: ${scrollBarsSizes.y}`);

      return { hasScrollX, hasScrollY, sizes: scrollBarsSizes };
    },
    [logger, columnsTotalWidth, props.autoPageSize, props.autoHeight, rowHeight, scrollbarSize],
  );

  const getViewport = React.useCallback(
    (
      rowsCount: number,
      scrollBarState: GridScrollBarState,
      windowSizes: ElementSize,
    ): GridViewportSizeState => {
      logger.debug('Calculating container sizes.');

      return {
        width: windowSizes.width - scrollBarState.sizes.y,
        height: props.autoHeight
          ? rowsCount * rowHeight
          : windowSizes.height - scrollBarState.sizes.x,
      };
    },
    [logger, props.autoHeight, rowHeight],
  );

  const getContainerProps = React.useCallback(
    (
      rowsCount: number,
      viewportSizes: GridViewportSizeState,
      scrollBarState: GridScrollBarState,
      windowSizes: ElementSize,
    ): GridContainerProps | null => {
      if (
        !windowRef ||
        !windowRef.current ||
        columnsTotalWidth === 0 ||
        Number.isNaN(columnsTotalWidth)
      ) {
        return null;
      }

      const requiredSize = rowsCount * rowHeight;
      const diff = requiredSize - windowSizes.height;
      // we activate virtualization when we have more than 2 rows outside the viewport
      const isVirtualized = diff > rowHeight * 2;

      if (props.autoPageSize || props.autoHeight || !isVirtualized) {
        const viewportFitHeightSize = Math.floor(viewportSizes.height / rowHeight);
        const viewportPageSize =
          scrollBarState.hasScrollY || rowsCount < viewportFitHeightSize
            ? rowsCount
            : viewportFitHeightSize;

        const requiredHeight = Math.max(
          viewportPageSize * rowHeight + (props.autoHeight ? scrollBarState.sizes.x : 0),
          1,
        );

        const indexes: GridContainerProps = {
          isVirtualized: false,
          virtualRowsCount: viewportPageSize,
          renderingZonePageSize: viewportPageSize,
          viewportPageSize,
          totalSizes: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          dataContainerSizes: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          renderingZoneScrollHeight: requiredHeight - viewportSizes.height,
          renderingZone: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          windowSizes,
          lastPage: 1,
        };
        logger.debug('Fixed container props', indexes);
        return indexes;
      }
      const viewportPageSize = Math.floor(viewportSizes.height / rowHeight);

      // Number of pages required to render the full set of rows in the viewport
      const viewportMaxPages =
        viewportPageSize > 0 ? Math.ceil(rowsCount / viewportPageSize) - 1 : 0;

      // We multiply by 2 for virtualization to work with useGridVirtualRows scroll system
      const renderingZonePageSize = viewportPageSize * 2;
      const renderingZoneHeight = renderingZonePageSize * rowHeight;
      const renderingZoneMaxScrollHeight = renderingZoneHeight - viewportSizes.height;

      let totalHeight = viewportMaxPages * renderingZoneMaxScrollHeight + viewportSizes.height;
      const rowsLeftOnLastPage = rowsCount % viewportPageSize;
      if (rowsLeftOnLastPage > 0) {
        totalHeight = totalHeight - renderingZoneMaxScrollHeight + rowsLeftOnLastPage * rowHeight;
      }

      const indexes: GridContainerProps = {
        isVirtualized,
        virtualRowsCount: rowsCount,
        viewportPageSize,
        totalSizes: {
          width: columnsTotalWidth,
          height: totalHeight,
        },
        dataContainerSizes: {
          width: columnsTotalWidth,
          height: totalHeight,
        },
        renderingZonePageSize,
        renderingZone: {
          width: columnsTotalWidth,
          height: renderingZoneHeight,
        },
        renderingZoneScrollHeight: renderingZoneMaxScrollHeight,
        windowSizes,
        lastPage: viewportMaxPages,
      };

      logger.debug('virtualized container props', indexes);
      return indexes;
    },
    [windowRef, columnsTotalWidth, rowHeight, props.autoPageSize, props.autoHeight, logger],
  );

  const refreshContainerSizes = React.useCallback(() => {
    logger.debug('Refreshing container sizes');

    if (!windowRef?.current) {
      return;
    }

    const window = windowRef.current.getBoundingClientRect();
    const windowSizes: ElementSize = { width: window.width, height: window.height };

    logger.debug(`window Size - W: ${windowSizes.width} H: ${windowSizes.height} `);

    const rowsCount = getVirtualRowCount();
    const scrollBar = getScrollBar(rowsCount, windowSizes);
    const viewportSizes = getViewport(rowsCount, scrollBar, windowSizes);
    const containerSizes = getContainerProps(rowsCount, viewportSizes, scrollBar, windowSizes);
    const prevState = apiRef.current.getState();

    let shouldUpdate = false;
    if (!isDeepEqual(prevState.scrollBar, scrollBar)) {
      setGridState((state) => ({ ...state, scrollBar }));
      shouldUpdate = true;
    }

    if (!isDeepEqual(prevState.viewportSizes, viewportSizes)) {
      setGridState((state) => ({ ...state, viewportSizes }));
      shouldUpdate = true;
    }

    if (!isDeepEqual(prevState.containerSizes, containerSizes)) {
      setGridState((state) => ({ ...state, containerSizes }));
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      forceUpdate();
    }
  }, [
    apiRef,
    logger,
    setGridState,
    forceUpdate,
    windowRef,
    getContainerProps,
    getScrollBar,
    getViewport,
    getVirtualRowCount,
  ]);

  React.useEffect(() => {
    refreshContainerSizes();
  }, [gridState.columns, props.hideFooter, refreshContainerSizes, visibleRowsCount]);

  useGridApiEventHandler(apiRef, GridEvents.debouncedResize, refreshContainerSizes);
};
