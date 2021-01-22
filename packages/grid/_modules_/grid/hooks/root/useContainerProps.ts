import * as React from 'react';
import { RESIZE } from '../../constants/eventsConstants';
import { ApiRef } from '../../models/api/apiRef';
import { ContainerProps, ScrollBarState, ViewportSizeState } from '../../models/containerProps';
import { ElementSize } from '../../models/elementSize';
import { isDeepEqual } from '../../utils/utils';
import { columnsTotalWidthSelector } from '../features/columns/columnsSelector';
import { GridState } from '../features/core/gridState';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { densityRowHeightSelector } from '../features/density/densitySelector';
import { visibleRowCountSelector } from '../features/filter/filterSelector';
import { PaginationState } from '../features/pagination/paginationReducer';
import { paginationSelector } from '../features/pagination/paginationSelector';
import { optionsSelector } from '../utils/optionsSelector';
import { useLogger } from '../utils/useLogger';
import { useApiEventHandler } from './useApiEventHandler';

export const useContainerProps = (windowRef: React.RefObject<HTMLDivElement>, apiRef: ApiRef) => {
  const logger = useLogger('useContainerProps');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const windowSizesRef = React.useRef<ElementSize>({ width: 0, height: 0 });

  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, densityRowHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, columnsTotalWidthSelector);
  const visibleRowsCount = useGridSelector(apiRef, visibleRowCountSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, paginationSelector);

  const getVirtualRowCount = React.useCallback(() => {
    logger.debug('Calculating virtual row count.');
    const currentPage = paginationState.page;
    let pageRowCount =
      options.pagination && paginationState.pageSize ? paginationState.pageSize : null;

    pageRowCount =
      !pageRowCount || currentPage * pageRowCount <= visibleRowsCount
        ? pageRowCount
        : visibleRowsCount - (currentPage - 1) * pageRowCount;

    const virtRowsCount =
      pageRowCount == null || pageRowCount > visibleRowsCount ? visibleRowsCount : pageRowCount;

    return virtRowsCount;
  }, [
    logger,
    options.pagination,
    paginationState.page,
    paginationState.pageSize,
    visibleRowsCount,
  ]);

  const getScrollBar = React.useCallback(
    (rowsCount: number) => {
      logger.debug('Calculating scrollbar sizes.');
      const hasScrollY =
        options.autoPageSize || options.autoHeight
          ? false
          : windowSizesRef.current.height < rowsCount * rowHeight;
      const hasScrollX = columnsTotalWidth > windowSizesRef.current.width;
      const scrollBarSize = {
        y: hasScrollY ? options.scrollbarSize : 0,
        x: hasScrollX ? options.scrollbarSize : 0,
      };
      return { hasScrollX, hasScrollY, scrollBarSize };
    },
    [
      logger,
      options.autoPageSize,
      options.autoHeight,
      options.scrollbarSize,
      rowHeight,
      columnsTotalWidth,
    ],
  );

  const getViewport = React.useCallback(
    (rowsCount: number, scrollBarState: ScrollBarState) => {
      if (!windowRef.current) {
        return null;
      }

      logger.debug('Calculating container sizes.');

      const window = windowRef.current.getBoundingClientRect();
      windowSizesRef.current = { width: window.width, height: window.height };

      logger.debug(
        `window Size - W: ${windowSizesRef.current.width} H: ${windowSizesRef.current.height} `,
      );

      const viewportSize = {
        width: windowSizesRef.current!.width - scrollBarState.scrollBarSize.y,
        height: options.autoHeight
          ? rowsCount * rowHeight
          : windowSizesRef.current!.height - scrollBarState.scrollBarSize.x,
      };
      return viewportSize;
    },
    [logger, options.autoHeight, rowHeight, windowRef],
  );

  const getContainerProps = React.useCallback(
    (
      rowsCount: number,
      viewportSizes: ViewportSizeState,
      scrollState: ScrollBarState,
    ): ContainerProps | null => {
      if (
        !windowRef ||
        !windowRef.current ||
        columnsTotalWidth === 0 ||
        Number.isNaN(columnsTotalWidth)
      ) {
        return null;
      }

      let viewportPageSize = viewportSizes.height / rowHeight;
      viewportPageSize = options.pagination
        ? Math.floor(viewportPageSize)
        : Math.round(viewportPageSize);

      // We multiply by 2 for virtualization
      // TODO allow buffer with fixed nb rows
      const rzPageSize = viewportPageSize * 2;
      const viewportMaxPage = options.autoPageSize ? 1 : Math.ceil(rowsCount / viewportPageSize);

      logger.debug(
        `viewportPageSize:  ${viewportPageSize}, rzPageSize: ${rzPageSize}, viewportMaxPage: ${viewportMaxPage}`,
      );
      const renderingZoneHeight = rzPageSize * rowHeight + rowHeight + scrollState.scrollBarSize.x;
      const dataContainerWidth = columnsTotalWidth - scrollState.scrollBarSize.y;
      let totalHeight =
        (options.autoPageSize ? 1 : rowsCount / viewportPageSize) * viewportSizes.height +
        (scrollState.hasScrollY ? scrollState.scrollBarSize.x : 0);

      if (options.autoHeight) {
        totalHeight = rowsCount * rowHeight + scrollState.scrollBarSize.x;
      }

      const indexes: ContainerProps = {
        virtualRowsCount: options.autoPageSize ? viewportPageSize : rowsCount,
        renderingZonePageSize: rzPageSize,
        viewportPageSize,
        totalSizes: {
          width: columnsTotalWidth,
          height: totalHeight || 1,
        },
        dataContainerSizes: {
          width: dataContainerWidth,
          height: totalHeight || 1,
        },
        renderingZone: {
          width: dataContainerWidth,
          height: renderingZoneHeight,
        },
        windowSizes: windowSizesRef.current,
        lastPage: viewportMaxPage,
      };

      logger.debug('returning container props', indexes);
      return indexes;
    },
    [
      windowRef,
      columnsTotalWidth,
      rowHeight,
      options.pagination,
      options.autoPageSize,
      options.autoHeight,
      logger,
    ],
  );

  const updateStateIfChanged = React.useCallback(
    (
      shouldUpdate: (oldState: GridState) => boolean,
      newStateUpdate: (state: GridState) => GridState,
    ) => {
      let update = false;
      setGridState((state) => {
        update = shouldUpdate(state);
        if (update) {
          return newStateUpdate(state);
        }
        return state;
      });
      if (update) {
        forceUpdate();
      }
    },
    [forceUpdate, setGridState],
  );

  const refreshContainerSizes = React.useCallback(() => {
    logger.debug('Refreshing container sizes');
    const rowsCount = getVirtualRowCount();
    const scrollBar = getScrollBar(rowsCount);

    const viewportSizes = getViewport(rowsCount, scrollBar);
    if (!viewportSizes) {
      return;
    }

    updateStateIfChanged(
      (state) => state.scrollBar !== scrollBar,
      (state) => ({ ...state, scrollBar }),
    );

    updateStateIfChanged(
      (state) => state.viewportSizes !== viewportSizes,
      (state) => ({ ...state, viewportSizes }),
    );

    const containerState = getContainerProps(rowsCount, viewportSizes, scrollBar);
    updateStateIfChanged(
      (state) => !isDeepEqual(state.containerSizes, containerState),
      (state) => ({ ...state, containerSizes: containerState }),
    );
  }, [
    getContainerProps,
    getScrollBar,
    getViewport,
    getVirtualRowCount,
    logger,
    updateStateIfChanged,
  ]);

  React.useEffect(() => {
    refreshContainerSizes();
  }, [gridState.columns, gridState.options.hideFooter, refreshContainerSizes, visibleRowsCount]);

  useApiEventHandler(apiRef, RESIZE, refreshContainerSizes);
};
