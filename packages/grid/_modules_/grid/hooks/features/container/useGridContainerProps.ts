import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { ElementSize } from '../../../models/elementSize';
import { isDeepEqual } from '../../../utils/utils';
import { gridColumnsTotalWidthSelector } from '../columns/gridColumnsSelector';
import { GridState } from '../../../models/gridState';
import { useGridSelector } from '../../utils/useGridSelector';
import { useGridState } from '../../utils/useGridState';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { gridVisibleRowCountSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridStateInit } from '../../utils/useGridStateInit';

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

/**
 * @requires useGridDensity (state)
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * TODO: Impossible priority - useGridPageSize also needs to be after useGridContainerProps
 */
export const useGridContainerProps = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'pagination'
    | 'autoPageSize'
    | 'pageSize'
    | 'autoHeight'
    | 'hideFooter'
    | 'scrollbarSize'
    | 'disableVirtualization'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridContainerProps');

  // TODO: Remove from the state an add direct computation method
  // See https://github.com/mui-org/material-ui-x/issues/820#issuecomment-897906608
  useGridStateInit(apiRef, (state) => ({
    ...state,
    containerSizes: null,
    viewportSizes: { width: 0, height: 1 },
    scrollBar: { hasScrollX: false, hasScrollY: false, sizes: { x: 0, y: 0 } },
  }));

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const windowSizesRef = React.useRef<ElementSize>({ width: 0, height: 0 });
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const visibleRowsCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const windowRef = apiRef.current.windowRef;

  const rootElement = apiRef.current.rootElementRef?.current;
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
    (rowsCount: number): GridScrollBarState => {
      logger.debug('Calculating scrollbar sizes.');

      let hasScrollX = columnsTotalWidth > windowSizesRef.current.width;
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
        requiredSize + scrollBarsSizes.x > windowSizesRef.current.height;

      scrollBarsSizes.y = hasScrollY ? scrollbarSize : 0;

      // We recalculate the scroll x to consider the size of the y scrollbar.
      hasScrollX = columnsTotalWidth + scrollBarsSizes.y > windowSizesRef.current.width;
      scrollBarsSizes.x = hasScrollX ? scrollbarSize : 0;

      logger.debug(`Scrollbar size on axis x: ${scrollBarsSizes.x}, y: ${scrollBarsSizes.y}`);

      return { hasScrollX, hasScrollY, sizes: scrollBarsSizes };
    },
    [logger, columnsTotalWidth, props.autoPageSize, props.autoHeight, rowHeight, scrollbarSize],
  );

  const getViewport = React.useCallback(
    (rowsCount: number, scrollBarState: GridScrollBarState) => {
      if (!windowRef?.current) {
        return null;
      }

      logger.debug('Calculating container sizes.');

      const window = windowRef.current.getBoundingClientRect();
      windowSizesRef.current = { width: window.width, height: window.height };

      logger.debug(
        `window Size - W: ${windowSizesRef.current.width} H: ${windowSizesRef.current.height} `,
      );

      const viewportSize = {
        width: windowSizesRef.current!.width - scrollBarState.sizes.y,
        height: props.autoHeight
          ? rowsCount * rowHeight
          : windowSizesRef.current!.height - scrollBarState.sizes.x,
      };
      return viewportSize;
    },
    [logger, props.autoHeight, rowHeight, windowRef],
  );

  const getContainerProps = React.useCallback(
    (
      rowsCount: number,
      viewportSizes: GridViewportSizeState,
      scrollBarState: GridScrollBarState,
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
      const diff = requiredSize - windowSizesRef.current.height;
      // we activate virtualization when we have more than 2 rows outside the viewport
      const isVirtualized = diff > rowHeight * 2 && !props.disableVirtualization;

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
          windowSizes: windowSizesRef.current,
          lastPage: 1,
        };
        logger.debug('Fixed container props', indexes);
        return indexes;
      }
      const viewportPageSize = Math.floor(viewportSizes.height / rowHeight);

      // Number of pages required to render the full set of rows in the viewport
      const viewportMaxPages =
        viewportPageSize > 0 ? Math.ceil(rowsCount / viewportPageSize) - 1 : 0;

      // We multiply by 2 for virtualization to work with useGridVirtualization scroll system
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
        windowSizes: windowSizesRef.current,
        lastPage: viewportMaxPages,
      };

      logger.debug('virtualized container props', indexes);
      return indexes;
    },
    [
      windowRef,
      columnsTotalWidth,
      rowHeight,
      props.autoPageSize,
      props.autoHeight,
      props.disableVirtualization,
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
  }, [gridState.columns, props.hideFooter, refreshContainerSizes, visibleRowsCount]);

  useGridApiEventHandler(apiRef, GridEvents.debouncedResize, refreshContainerSizes);
};
