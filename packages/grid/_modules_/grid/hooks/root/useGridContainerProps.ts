import * as React from 'react';
import { GRID_DEBOUNCED_RESIZE } from '../../constants/eventsConstants';
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
import { optionsSelector } from '../utils/optionsSelector';
import { useLogger } from '../utils/useLogger';
import { useGridApiEventHandler } from './useGridApiEventHandler';

export const useGridContainerProps = (apiRef: GridApiRef) => {
  const logger = useLogger('useGridContainerProps');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const visibleRowsCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const windowRef = apiRef.current.windowRef;

  const getVirtualRowCount = React.useCallback(() => {
    logger.debug('Calculating virtual row count.');
    if (options.pagination && (!options.autoPageSize || options.pageSize)) {
      const rowsLeft = visibleRowsCount - paginationState.page * paginationState.pageSize;
      return rowsLeft > paginationState.pageSize ? paginationState.pageSize : rowsLeft;
    }
    return visibleRowsCount;
  }, [
    logger,
    options.autoPageSize,
    options.pagination,
    options.pageSize,
    paginationState.page,
    paginationState.pageSize,
    visibleRowsCount,
  ]);

  const getScrollBar = React.useCallback(
    (rowsCount: number, windowSizes: ElementSize): GridScrollBarState => {
      logger.debug('Calculating scrollbar sizes.');

      let hasScrollX = columnsTotalWidth > windowSizes.width;
      const scrollBarSize = {
        y: 0,
        x: hasScrollX ? options.scrollbarSize! : 0,
      };

      if (rowsCount === 0) {
        return { hasScrollX, hasScrollY: false, scrollBarSize };
      }

      const requiredSize = rowsCount * rowHeight;

      const hasScrollY =
        !options.autoPageSize &&
        !options.autoHeight &&
        requiredSize + scrollBarSize.x > windowSizes.height;

      scrollBarSize.y = hasScrollY ? options.scrollbarSize! : 0;

      // We recalculate the scroll x to consider the size of the y scrollbar.
      hasScrollX = columnsTotalWidth + scrollBarSize.y > windowSizes.width;
      scrollBarSize.x = hasScrollX ? options.scrollbarSize! : 0;

      logger.debug(`Scrollbar size on axis x: ${scrollBarSize.x}, y: ${scrollBarSize.y}`);

      return { hasScrollX, hasScrollY, scrollBarSize };
    },
    [
      logger,
      columnsTotalWidth,
      options.autoPageSize,
      options.autoHeight,
      rowHeight,
      options.scrollbarSize,
    ],
  );

  const getViewport = React.useCallback(
    (
      rowsCount: number,
      scrollBarState: GridScrollBarState,
      windowSizes: ElementSize,
    ): GridViewportSizeState => {
      logger.debug('Calculating container sizes.');

      return {
        width: windowSizes.width - scrollBarState.scrollBarSize.y,
        height: options.autoHeight
          ? rowsCount * rowHeight
          : windowSizes.height - scrollBarState.scrollBarSize.x,
      };
    },
    [logger, options.autoHeight, rowHeight],
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

      if (options.autoPageSize || options.autoHeight || !isVirtualized) {
        const viewportFitHeightSize = Math.floor(viewportSizes.height / rowHeight);
        const viewportPageSize =
          scrollBarState.hasScrollY || rowsCount < viewportFitHeightSize
            ? rowsCount
            : viewportFitHeightSize;

        const requiredHeight = Math.max(
          viewportPageSize * rowHeight + (options.autoHeight ? scrollBarState.scrollBarSize.x : 0),
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
    [windowRef, columnsTotalWidth, rowHeight, options.autoPageSize, options.autoHeight, logger],
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
  }, [gridState.columns, gridState.options.hideFooter, refreshContainerSizes, visibleRowsCount]);

  useGridApiEventHandler(apiRef, GRID_DEBOUNCED_RESIZE, refreshContainerSizes);
};
