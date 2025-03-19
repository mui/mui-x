import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useLazyRef from '@mui/utils/useLazyRef';
import useTimeout from '@mui/utils/useTimeout';
import { useRtl } from '@mui/system/RtlProvider';
import reactMajor from '@mui/x-internals/reactMajor';
import {
  gridDimensionsSelector,
  gridColumnsTotalWidthSelector,
  gridContentHeightSelector,
  gridHasFillerSelector,
  gridRowHeightSelector,
  gridVerticalScrollbarWidthSelector,
} from '../dimensions/gridDimensionsSelectors';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import { useRunOnce } from '../../utils/useRunOnce';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  gridHasColSpanSelector,
} from '../columns/gridColumnsSelector';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';
import { GridPinnedRowsPosition } from '../rows/gridRowsInterfaces';
import { useGridVisibleRows, getVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridApiOptionHandler } from '../../utils';
import * as platform from '../../../utils/platform';
import { clamp, range } from '../../../utils/utils';
import {
  type GridRenderContext,
  type GridColumnsRenderContext,
  type GridRowEntry,
  type GridRowId,
} from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getFirstNonSpannedColumnToRender } from '../columns/gridColumnsUtils';
import { GridInfiniteLoaderPrivateApi } from '../../../models/api/gridInfiniteLoaderApi';
import {
  gridRenderContextSelector,
  gridVirtualizationRowEnabledSelector,
  gridVirtualizationColumnEnabledSelector,
} from './gridVirtualizationSelectors';
import { EMPTY_RENDER_CONTEXT } from './useGridVirtualization';
import { gridRowSpanningHiddenCellsOriginMapSelector } from '../rows/gridRowSpanningSelectors';
import { gridListColumnSelector } from '../listView/gridListViewSelectors';
import { minimalContentHeight } from '../rows/gridRowsUtils';
import { EMPTY_PINNED_COLUMN_FIELDS, GridPinnedColumns } from '../columns';
import { gridFocusedVirtualCellSelector } from './gridFocusedVirtualCellSelector';
import { roundToDecimalPlaces } from '../../../utils/roundToDecimalPlaces';
import { isJSDOM } from '../../../utils/isJSDOM';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { gridRowSelectionManagerSelector } from '../rowSelection';

const MINIMUM_COLUMN_WIDTH = 50;

interface PrivateApiWithInfiniteLoader
  extends GridPrivateApiCommunity,
    GridInfiniteLoaderPrivateApi {}

export type VirtualScroller = ReturnType<typeof useGridVirtualScroller>;

type ScrollPosition = { top: number; left: number };
enum ScrollDirection {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const EMPTY_SCROLL_POSITION = { top: 0, left: 0 };

export const EMPTY_DETAIL_PANELS = Object.freeze(new Map<GridRowId, React.ReactNode>());

const createScrollCache = (
  isRtl: boolean,
  rowBufferPx: number,
  columnBufferPx: number,
  verticalBuffer: number,
  horizontalBuffer: number,
) => ({
  direction: ScrollDirection.NONE,
  buffer: bufferForDirection(
    isRtl,
    ScrollDirection.NONE,
    rowBufferPx,
    columnBufferPx,
    verticalBuffer,
    horizontalBuffer,
  ),
});
type ScrollCache = ReturnType<typeof createScrollCache>;

export const useGridVirtualScroller = () => {
  const apiRef = useGridPrivateApiContext() as RefObject<PrivateApiWithInfiniteLoader>;
  const rootProps = useGridRootProps();
  const { unstable_listView: listView } = rootProps;
  const visibleColumns = useGridSelector(apiRef, () =>
    listView ? [gridListColumnSelector(apiRef)!] : gridVisibleColumnDefinitionsSelector(apiRef),
  );
  const enabledForRows = useGridSelector(apiRef, gridVirtualizationRowEnabledSelector) && !isJSDOM;
  const enabledForColumns =
    useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector) && !isJSDOM;

  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumnDefinitions = gridVisiblePinnedColumnDefinitionsSelector(apiRef);
  const pinnedColumns = listView
    ? (EMPTY_PINNED_COLUMN_FIELDS as unknown as GridPinnedColumns)
    : pinnedColumnDefinitions;
  const hasBottomPinnedRows = pinnedRows.bottom.length > 0;
  const [panels, setPanels] = React.useState(EMPTY_DETAIL_PANELS);

  const isRtl = useRtl();
  const rowSelectionManager = useGridSelector(apiRef, gridRowSelectionManagerSelector);
  const currentPage = useGridVisibleRows(apiRef);
  const mainRef = apiRef.current.mainElementRef;
  const scrollerRef = apiRef.current.virtualScrollerRef;
  const scrollbarVerticalRef = apiRef.current.virtualScrollbarVerticalRef;
  const scrollbarHorizontalRef = apiRef.current.virtualScrollbarHorizontalRef;
  const hasColSpan = useGridSelector(apiRef, gridHasColSpanSelector);
  const isRenderContextReady = React.useRef(false);

  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const contentHeight = useGridSelector(apiRef, gridContentHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const needsHorizontalScrollbar = useGridSelector(apiRef, needsHorizontalScrollbarSelector);
  const verticalScrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
  const gridHasFiller = useGridSelector(apiRef, gridHasFillerSelector);

  const previousSize = React.useRef<{ width: number; height: number }>(null);

  const mainRefCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      mainRef.current = node;

      if (!node) {
        return undefined;
      }

      const initialRect = node.getBoundingClientRect();
      let lastSize = {
        width: roundToDecimalPlaces(initialRect.width, 1),
        height: roundToDecimalPlaces(initialRect.height, 1),
      };

      if (
        !previousSize.current ||
        (lastSize.width !== previousSize.current.width &&
          lastSize.height !== previousSize.current.height)
      ) {
        previousSize.current = lastSize;
        apiRef.current.publishEvent('resize', lastSize);
      }

      if (typeof ResizeObserver === 'undefined') {
        return undefined;
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        const newSize = {
          width: roundToDecimalPlaces(entry.contentRect.width, 1),
          height: roundToDecimalPlaces(entry.contentRect.height, 1),
        };

        if (newSize.width === lastSize.width && newSize.height === lastSize.height) {
          return;
        }

        apiRef.current.publishEvent('resize', newSize);
        lastSize = newSize;
      });

      observer.observe(node);

      if (reactMajor >= 19) {
        return () => {
          mainRef.current = null;
          observer.disconnect();
        };
      }
      return undefined;
    },
    [apiRef, mainRef],
  );

  /*
   * Scroll context logic
   * ====================
   * We only render the cells contained in the `renderContext`. However, when the user starts scrolling the grid
   * in a direction, we want to render as many cells as possible in that direction, as to avoid presenting white
   * areas if the user scrolls too fast/far and the viewport ends up in a region we haven't rendered yet. To render
   * more cells, we store some offsets to add to the viewport in `scrollCache.buffer`. Those offsets make the render
   * context wider in the direction the user is going, but also makes the buffer around the viewport `0` for the
   * dimension (horizontal or vertical) in which the user is not scrolling. So if the normal viewport is 8 columns
   * wide, with a 1 column buffer (10 columns total), then we want it to be exactly 8 columns wide during vertical
   * scroll.
   * However, we don't want the rows in the old context to re-render from e.g. 10 columns to 8 columns, because that's
   * work that's not necessary. Thus we store the context at the start of the scroll in `frozenContext`, and the rows
   * that are part of this old context will keep their same render context as to avoid re-rendering.
   */
  const scrollPosition = React.useRef(rootProps.initialState?.scroll ?? EMPTY_SCROLL_POSITION);
  const ignoreNextScrollEvent = React.useRef(false);
  const previousContextScrollPosition = React.useRef(EMPTY_SCROLL_POSITION);
  const previousRowContext = React.useRef(EMPTY_RENDER_CONTEXT);
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);

  const focusedVirtualCell = useGridSelector(apiRef, gridFocusedVirtualCellSelector);

  const scrollTimeout = useTimeout();
  const frozenContext = React.useRef<GridRenderContext | undefined>(undefined);
  const scrollCache = useLazyRef(() =>
    createScrollCache(
      isRtl,
      rootProps.rowBufferPx,
      rootProps.columnBufferPx,
      rowHeight * 15,
      MINIMUM_COLUMN_WIDTH * 6,
    ),
  ).current;

  const updateRenderContext = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      if (
        areRenderContextsEqual(nextRenderContext, apiRef.current.state.virtualization.renderContext)
      ) {
        return;
      }

      const didRowsIntervalChange =
        nextRenderContext.firstRowIndex !== previousRowContext.current.firstRowIndex ||
        nextRenderContext.lastRowIndex !== previousRowContext.current.lastRowIndex;

      apiRef.current.setState((state) => {
        return {
          ...state,
          virtualization: {
            ...state.virtualization,
            renderContext: nextRenderContext,
          },
        };
      });

      // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
      // but only does something if we already have a render context, because
      // otherwise we would call an update directly on mount
      const isReady = gridDimensionsSelector(apiRef).isReady;
      if (isReady && didRowsIntervalChange) {
        previousRowContext.current = nextRenderContext;
        apiRef.current.publishEvent('renderedRowsIntervalChange', nextRenderContext);
      }

      previousContextScrollPosition.current = scrollPosition.current;
    },
    [apiRef],
  );

  const triggerUpdateRenderContext = useEventCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    const dimensions = gridDimensionsSelector(apiRef);
    const maxScrollTop = Math.ceil(
      dimensions.minimumSize.height - dimensions.viewportOuterSize.height,
    );
    const maxScrollLeft = Math.ceil(
      dimensions.minimumSize.width - dimensions.viewportInnerSize.width,
    );

    // Clamp the scroll position to the viewport to avoid re-calculating the render context for scroll bounce
    const newScroll = {
      top: clamp(scroller.scrollTop, 0, maxScrollTop),
      left: isRtl
        ? clamp(scroller.scrollLeft, -maxScrollLeft, 0)
        : clamp(scroller.scrollLeft, 0, maxScrollLeft),
    };

    const dx = newScroll.left - scrollPosition.current.left;
    const dy = newScroll.top - scrollPosition.current.top;

    const isScrolling = dx !== 0 || dy !== 0;

    scrollPosition.current = newScroll;

    const direction = isScrolling ? directionForDelta(dx, dy) : ScrollDirection.NONE;

    // Since previous render, we have scrolled...
    const rowScroll = Math.abs(
      scrollPosition.current.top - previousContextScrollPosition.current.top,
    );
    const columnScroll = Math.abs(
      scrollPosition.current.left - previousContextScrollPosition.current.left,
    );

    // PERF: use the computed minimum column width instead of a static one
    const didCrossThreshold = rowScroll >= rowHeight || columnScroll >= MINIMUM_COLUMN_WIDTH;
    const didChangeDirection = scrollCache.direction !== direction;
    const shouldUpdate = didCrossThreshold || didChangeDirection;

    if (!shouldUpdate) {
      return renderContext;
    }

    // Render a new context

    if (didChangeDirection) {
      switch (direction) {
        case ScrollDirection.NONE:
        case ScrollDirection.LEFT:
        case ScrollDirection.RIGHT:
          frozenContext.current = undefined;
          break;
        default:
          frozenContext.current = renderContext;
          break;
      }
    }

    scrollCache.direction = direction;
    scrollCache.buffer = bufferForDirection(
      isRtl,
      direction,
      rootProps.rowBufferPx,
      rootProps.columnBufferPx,
      rowHeight * 15,
      MINIMUM_COLUMN_WIDTH * 6,
    );

    const inputs = inputsSelector(apiRef, rootProps, enabledForRows, enabledForColumns);
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);

    // Prevents batching render context changes
    ReactDOM.flushSync(() => {
      updateRenderContext(nextRenderContext);
    });

    scrollTimeout.start(1000, triggerUpdateRenderContext);

    return nextRenderContext;
  });

  const forceUpdateRenderContext = () => {
    // skip update if dimensions are not ready and virtualization is enabled
    if (!gridDimensionsSelector(apiRef).isReady && (enabledForRows || enabledForColumns)) {
      return;
    }
    const inputs = inputsSelector(apiRef, rootProps, enabledForRows, enabledForColumns);
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);
    // Reset the frozen context when the render context changes, see the illustration in https://github.com/mui/mui-x/pull/12353
    frozenContext.current = undefined;
    updateRenderContext(nextRenderContext);
  };

  const handleScroll = useEventCallback(() => {
    if (ignoreNextScrollEvent.current) {
      ignoreNextScrollEvent.current = false;
      return;
    }

    const nextRenderContext = triggerUpdateRenderContext();

    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollPosition.current.top,
      left: scrollPosition.current.left,
      renderContext: nextRenderContext,
    });
  });

  const handleWheel = useEventCallback((event: React.WheelEvent) => {
    apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
  });

  const handleTouchMove = useEventCallback((event: React.TouchEvent) => {
    apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
  });

  const getRows = (
    params: {
      rows?: GridRowEntry[];
      position?: GridPinnedRowsPosition;
      renderContext?: GridRenderContext;
    } = {},
  ) => {
    if (!params.rows && !currentPage.range) {
      return [];
    }

    let baseRenderContext = renderContext;
    if (params.renderContext) {
      baseRenderContext = params.renderContext as GridRenderContext;

      baseRenderContext.firstColumnIndex = renderContext.firstColumnIndex;
      baseRenderContext.lastColumnIndex = renderContext.lastColumnIndex;
    }

    const isLastSection =
      (!hasBottomPinnedRows && params.position === undefined) ||
      (hasBottomPinnedRows && params.position === 'bottom');
    const isPinnedSection = params.position !== undefined;

    let rowIndexOffset: number;
    // FIXME: Why is the switch check exhaustiveness not validated with typescript-eslint?
    // eslint-disable-next-line default-case
    switch (params.position) {
      case 'top':
        rowIndexOffset = 0;
        break;
      case 'bottom':
        rowIndexOffset = pinnedRows.top.length + currentPage.rows.length;
        break;
      case undefined:
        rowIndexOffset = pinnedRows.top.length;
        break;
    }

    const rowModels = params.rows ?? currentPage.rows;

    const firstRowToRender = baseRenderContext.firstRowIndex;
    const lastRowToRender = Math.min(baseRenderContext.lastRowIndex, rowModels.length);

    const rowIndexes = params.rows
      ? range(0, params.rows.length)
      : range(firstRowToRender, lastRowToRender);

    let virtualRowIndex = -1;
    if (!isPinnedSection && focusedVirtualCell) {
      if (focusedVirtualCell.rowIndex < firstRowToRender) {
        rowIndexes.unshift(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
      }
      if (focusedVirtualCell.rowIndex > lastRowToRender) {
        rowIndexes.push(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
      }
    }

    const rows: React.ReactNode[] = [];
    const rowProps = rootProps.slotProps?.row;
    const columnPositions = gridColumnPositionsSelector(apiRef);

    rowIndexes.forEach((rowIndexInPage) => {
      const { id, model } = rowModels[rowIndexInPage];
      const rowIndex = (currentPage?.range?.firstRowIndex || 0) + rowIndexOffset + rowIndexInPage;

      // NOTE: This is an expensive feature, the colSpan code could be optimized.
      if (hasColSpan) {
        const minFirstColumn = pinnedColumns.left.length;
        const maxLastColumn = visibleColumns.length - pinnedColumns.right.length;

        apiRef.current.calculateColSpan({
          rowId: id,
          minFirstColumn,
          maxLastColumn,
          columns: visibleColumns,
        });

        if (pinnedColumns.left.length > 0) {
          apiRef.current.calculateColSpan({
            rowId: id,
            minFirstColumn: 0,
            maxLastColumn: pinnedColumns.left.length,
            columns: visibleColumns,
          });
        }

        if (pinnedColumns.right.length > 0) {
          apiRef.current.calculateColSpan({
            rowId: id,
            minFirstColumn: visibleColumns.length - pinnedColumns.right.length,
            maxLastColumn: visibleColumns.length,
            columns: visibleColumns,
          });
        }
      }

      const baseRowHeight = !apiRef.current.rowHasAutoHeight(id)
        ? apiRef.current.unstable_getRowHeight(id)
        : 'auto';

      const isSelected = rowSelectionManager.has(id) && apiRef.current.isRowSelectable(id);

      let isFirstVisible = false;
      if (params.position === undefined) {
        isFirstVisible = rowIndexInPage === 0;
      }

      let isLastVisible = false;
      const isLastVisibleInSection = rowIndexInPage === rowModels.length - 1;
      if (isLastSection) {
        if (!isPinnedSection) {
          const lastIndex = currentPage.rows.length - 1;
          const isLastVisibleRowIndex = rowIndexInPage === lastIndex;

          if (isLastVisibleRowIndex) {
            isLastVisible = true;
          }
        } else {
          isLastVisible = isLastVisibleInSection;
        }
      }

      let currentRenderContext = baseRenderContext;
      if (
        frozenContext.current &&
        rowIndexInPage >= frozenContext.current.firstRowIndex &&
        rowIndexInPage < frozenContext.current.lastRowIndex
      ) {
        currentRenderContext = frozenContext.current;
      }

      const isVirtualFocusRow = rowIndexInPage === virtualRowIndex;
      const isVirtualFocusColumn = focusedVirtualCell?.rowIndex === rowIndex;

      const offsetLeft = computeOffsetLeft(
        columnPositions,
        currentRenderContext,
        pinnedColumns.left.length,
      );
      const showBottomBorder = isLastVisibleInSection && params.position === 'top';

      const firstColumnIndex = currentRenderContext.firstColumnIndex;
      const lastColumnIndex = currentRenderContext.lastColumnIndex;

      rows.push(
        <rootProps.slots.row
          key={id}
          row={model}
          rowId={id}
          index={rowIndex}
          selected={isSelected}
          offsetLeft={offsetLeft}
          columnsTotalWidth={columnsTotalWidth}
          rowHeight={baseRowHeight}
          pinnedColumns={pinnedColumns}
          visibleColumns={visibleColumns}
          firstColumnIndex={firstColumnIndex}
          lastColumnIndex={lastColumnIndex}
          focusedColumnIndex={isVirtualFocusColumn ? focusedVirtualCell!.columnIndex : undefined}
          isFirstVisible={isFirstVisible}
          isLastVisible={isLastVisible}
          isNotVisible={isVirtualFocusRow}
          showBottomBorder={showBottomBorder}
          scrollbarWidth={verticalScrollbarWidth}
          gridHasFiller={gridHasFiller}
          {...rowProps}
        />,
      );

      if (isVirtualFocusRow) {
        return;
      }

      const panel = panels.get(id);
      if (panel) {
        rows.push(panel);
      }
      if (params.position === undefined && isLastVisibleInSection) {
        rows.push(apiRef.current.getInfiniteLoadingTriggerElement?.({ lastRowId: id }));
      }
    });
    return rows;
  };

  const scrollerStyle = React.useMemo(
    () =>
      ({
        overflowX: !needsHorizontalScrollbar || listView ? 'hidden' : undefined,
        overflowY: rootProps.autoHeight ? 'hidden' : undefined,
      }) as React.CSSProperties,
    [needsHorizontalScrollbar, rootProps.autoHeight, listView],
  );

  const contentSize = React.useMemo(() => {
    const size: React.CSSProperties = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      flexBasis: contentHeight,
      flexShrink: 0,
    };

    if (size.flexBasis === 0) {
      size.flexBasis = minimalContentHeight; // Give room to show the overlay when there no rows.
    }

    return size;
  }, [columnsTotalWidth, contentHeight, needsHorizontalScrollbar]);

  const onContentSizeApplied = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return;
      }
      apiRef.current.publishEvent('virtualScrollerContentSizeChange', {
        columnsTotalWidth,
        contentHeight,
      });
    },
    [apiRef, columnsTotalWidth, contentHeight],
  );

  useEnhancedEffect(() => {
    if (!isRenderContextReady.current) {
      return;
    }
    apiRef.current.updateRenderContext?.();
  }, [apiRef, enabledForColumns, enabledForRows]);

  useEnhancedEffect(() => {
    if (listView) {
      scrollerRef.current!.scrollLeft = 0;
    }
  }, [listView, scrollerRef]);

  useRunOnce(renderContext !== EMPTY_RENDER_CONTEXT, () => {
    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollPosition.current.top,
      left: scrollPosition.current.left,
      renderContext,
    });

    isRenderContextReady.current = true;

    if (rootProps.initialState?.scroll && scrollerRef.current) {
      const scroller = scrollerRef.current;
      const { top, left } = rootProps.initialState.scroll;

      // On initial mount, if we have columns available, we can restore the horizontal scroll immediately, but we need to skip the resulting scroll event, otherwise we would recalculate the render context at position top=0, left=restoredValue, but the initial render context is already calculated based on the initial value of scrollPosition ref.
      const isScrollRestored = {
        top: !(top > 0),
        left: !(left > 0),
      };
      if (!isScrollRestored.left && columnsTotalWidth) {
        scroller.scrollLeft = left;
        ignoreNextScrollEvent.current = true;
        isScrollRestored.left = true;
      }

      // For the sake of completeness, but I'm not sure if contentHeight is ever available at this point. Maybe when virtualisation is disabled?
      if (!isScrollRestored.top && contentHeight) {
        scroller.scrollTop = top;
        ignoreNextScrollEvent.current = true;
        isScrollRestored.top = true;
      }

      // To restore the vertical scroll, we need to wait until the rows are available in the DOM (otherwise there's nowhere to scroll), but before paint to avoid reflows
      if (!isScrollRestored.top || !isScrollRestored.left) {
        const unsubscribeContentSizeChange = apiRef.current.subscribeEvent(
          'virtualScrollerContentSizeChange',
          (params) => {
            if (!isScrollRestored.left && params.columnsTotalWidth) {
              scroller.scrollLeft = left;
              ignoreNextScrollEvent.current = true;
              isScrollRestored.left = true;
            }
            if (!isScrollRestored.top && params.contentHeight) {
              scroller.scrollTop = top;
              ignoreNextScrollEvent.current = true;
              isScrollRestored.top = true;
            }
            if (isScrollRestored.left && isScrollRestored.top) {
              unsubscribeContentSizeChange();
            }
          },
        );

        return unsubscribeContentSizeChange;
      }
    }

    return undefined;
  });

  apiRef.current.register('private', {
    updateRenderContext: forceUpdateRenderContext,
  });

  useGridApiOptionHandler(apiRef, 'sortedRowsSet', forceUpdateRenderContext);
  useGridApiOptionHandler(apiRef, 'paginationModelChange', forceUpdateRenderContext);
  useGridApiOptionHandler(apiRef, 'columnsChange', forceUpdateRenderContext);

  return {
    renderContext,
    setPanels,
    getRows,
    getContainerProps: () => ({
      ref: mainRefCallback,
    }),
    getScrollerProps: () => ({
      ref: scrollerRef,
      onScroll: handleScroll,
      onWheel: handleWheel,
      onTouchMove: handleTouchMove,
      style: scrollerStyle,
      role: 'presentation',
      // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
      // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
      tabIndex: platform.isFirefox ? -1 : undefined,
    }),
    getContentProps: () => ({
      style: contentSize,
      role: 'presentation',
      ref: onContentSizeApplied,
    }),
    getRenderZoneProps: () => ({ role: 'rowgroup' }),
    getScrollbarVerticalProps: () => ({
      ref: scrollbarVerticalRef,
      scrollPosition,
    }),
    getScrollbarHorizontalProps: () => ({
      ref: scrollbarHorizontalRef,
      scrollPosition,
    }),
    getScrollAreaProps: () => ({
      scrollPosition,
    }),
  };
};

type RenderContextInputs = {
  enabledForRows: boolean;
  enabledForColumns: boolean;
  apiRef: RefObject<GridPrivateApiCommunity>;
  autoHeight: boolean;
  rowBufferPx: number;
  columnBufferPx: number;
  leftPinnedWidth: number;
  columnsTotalWidth: number;
  viewportInnerWidth: number;
  viewportInnerHeight: number;
  lastRowHeight: number;
  lastColumnWidth: number;
  rowsMeta: ReturnType<typeof gridRowsMetaSelector>;
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
  rows: ReturnType<typeof useGridVisibleRows>['rows'];
  range: ReturnType<typeof useGridVisibleRows>['range'];
  pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;
  visibleColumns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>;
  hiddenCellsOriginMap: ReturnType<typeof gridRowSpanningHiddenCellsOriginMapSelector>;
  listView: boolean;
  virtualizeColumnsWithAutoRowHeight: DataGridProcessedProps['virtualizeColumnsWithAutoRowHeight'];
};

// dimension selectors
function needsHorizontalScrollbarSelector(apiRef: RefObject<GridApiCommunity>) {
  return (
    apiRef.current.state.dimensions.viewportOuterSize.width > 0 &&
    apiRef.current.state.dimensions.columnsTotalWidth >
      apiRef.current.state.dimensions.viewportOuterSize.width
  );
}

function inputsSelector(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: ReturnType<typeof useGridRootProps>,
  enabledForRows: boolean,
  enabledForColumns: boolean,
): RenderContextInputs {
  const dimensions = gridDimensionsSelector(apiRef);
  const currentPage = getVisibleRows(apiRef, rootProps);
  const visibleColumns = rootProps.unstable_listView
    ? [gridListColumnSelector(apiRef)!]
    : gridVisibleColumnDefinitionsSelector(apiRef);
  const hiddenCellsOriginMap = gridRowSpanningHiddenCellsOriginMapSelector(apiRef);
  const lastRowId = apiRef.current.state.rows.dataRowIds.at(-1);
  const lastColumn = visibleColumns.at(-1);
  return {
    enabledForRows,
    enabledForColumns,
    apiRef,
    autoHeight: rootProps.autoHeight,
    rowBufferPx: rootProps.rowBufferPx,
    columnBufferPx: rootProps.columnBufferPx,
    leftPinnedWidth: dimensions.leftPinnedWidth,
    columnsTotalWidth: dimensions.columnsTotalWidth,
    viewportInnerWidth: dimensions.viewportInnerSize.width,
    viewportInnerHeight: dimensions.viewportInnerSize.height,
    lastRowHeight: lastRowId !== undefined ? apiRef.current.unstable_getRowHeight(lastRowId) : 0,
    lastColumnWidth: lastColumn?.computedWidth ?? 0,
    rowsMeta: gridRowsMetaSelector(apiRef),
    columnPositions: gridColumnPositionsSelector(apiRef),
    rows: currentPage.rows,
    range: currentPage.range,
    pinnedColumns: gridVisiblePinnedColumnDefinitionsSelector(apiRef),
    visibleColumns,
    hiddenCellsOriginMap,
    listView: rootProps.unstable_listView ?? false,
    virtualizeColumnsWithAutoRowHeight: rootProps.virtualizeColumnsWithAutoRowHeight,
  };
}

function computeRenderContext(
  inputs: RenderContextInputs,
  scrollPosition: ScrollPosition,
  scrollCache: ScrollCache,
) {
  const renderContext: GridRenderContext = {
    firstRowIndex: 0,
    lastRowIndex: inputs.rows.length,
    firstColumnIndex: 0,
    lastColumnIndex: inputs.visibleColumns.length,
  };

  if (inputs.listView) {
    return {
      ...renderContext,
      lastColumnIndex: 1,
    };
  }

  const { top, left } = scrollPosition;
  const realLeft = Math.abs(left) + inputs.leftPinnedWidth;

  if (inputs.enabledForRows) {
    // Clamp the value because the search may return an index out of bounds.
    // In the last index, this is not needed because Array.slice doesn't include it.
    let firstRowIndex = Math.min(
      getNearestIndexToRender(inputs, top, {
        atStart: true,
        lastPosition:
          inputs.rowsMeta.positions[inputs.rowsMeta.positions.length - 1] + inputs.lastRowHeight,
      }),
      inputs.rowsMeta.positions.length - 1,
    );

    // If any of the cells in the `firstRowIndex` is hidden due to an extended row span,
    // Make sure the row from where the rowSpan is originated is visible.
    const rowSpanHiddenCellOrigin = inputs.hiddenCellsOriginMap[firstRowIndex];
    if (rowSpanHiddenCellOrigin) {
      const minSpannedRowIndex = Math.min(...Object.values(rowSpanHiddenCellOrigin));
      firstRowIndex = Math.min(firstRowIndex, minSpannedRowIndex);
    }

    const lastRowIndex = inputs.autoHeight
      ? firstRowIndex + inputs.rows.length
      : getNearestIndexToRender(inputs, top + inputs.viewportInnerHeight);

    renderContext.firstRowIndex = firstRowIndex;
    renderContext.lastRowIndex = lastRowIndex;
  }

  if (inputs.enabledForColumns) {
    let firstColumnIndex = 0;
    let lastColumnIndex = inputs.columnPositions.length;

    let hasRowWithAutoHeight = false;

    const [firstRowToRender, lastRowToRender] = getIndexesToRender({
      firstIndex: renderContext.firstRowIndex,
      lastIndex: renderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: inputs.rows.length,
      bufferBefore: scrollCache.buffer.rowBefore,
      bufferAfter: scrollCache.buffer.rowAfter,
      positions: inputs.rowsMeta.positions,
      lastSize: inputs.lastRowHeight,
    });

    if (!inputs.virtualizeColumnsWithAutoRowHeight) {
      for (let i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
        const row = inputs.rows[i];
        hasRowWithAutoHeight = inputs.apiRef.current.rowHasAutoHeight(row.id);
      }
    }

    if (!hasRowWithAutoHeight || inputs.virtualizeColumnsWithAutoRowHeight) {
      firstColumnIndex = binarySearch(realLeft, inputs.columnPositions, {
        atStart: true,
        lastPosition: inputs.columnsTotalWidth,
      });
      lastColumnIndex = binarySearch(realLeft + inputs.viewportInnerWidth, inputs.columnPositions);
    }

    renderContext.firstColumnIndex = firstColumnIndex;
    renderContext.lastColumnIndex = lastColumnIndex;
  }

  const actualRenderContext = deriveRenderContext(inputs, renderContext, scrollCache);

  return actualRenderContext;
}

function getNearestIndexToRender(
  inputs: RenderContextInputs,
  offset: number,
  options?: SearchOptions,
) {
  const lastMeasuredIndexRelativeToAllRows = inputs.apiRef.current.getLastMeasuredRowIndex();
  let allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
  if (inputs.range?.lastRowIndex && !allRowsMeasured) {
    // Check if all rows in this page are already measured
    allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= inputs.range.lastRowIndex;
  }

  const lastMeasuredIndexRelativeToCurrentPage = clamp(
    lastMeasuredIndexRelativeToAllRows - (inputs.range?.firstRowIndex || 0),
    0,
    inputs.rowsMeta.positions.length,
  );

  if (
    allRowsMeasured ||
    inputs.rowsMeta.positions[lastMeasuredIndexRelativeToCurrentPage] >= offset
  ) {
    // If all rows were measured (when no row has "auto" as height) or all rows before the offset
    // were measured, then use a binary search because it's faster.
    return binarySearch(offset, inputs.rowsMeta.positions, options);
  }

  // Otherwise, use an exponential search.
  // If rows have "auto" as height, their positions will be based on estimated heights.
  // In this case, we can skip several steps until we find a position higher than the offset.
  // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
  return exponentialSearch(
    offset,
    inputs.rowsMeta.positions,
    lastMeasuredIndexRelativeToCurrentPage,
    options,
  );
}

/**
 * Accepts as input a raw render context (the area visible in the viewport) and adds
 * computes the actual render context based on pinned elements, buffer dimensions and
 * spanning.
 */
function deriveRenderContext(
  inputs: RenderContextInputs,
  nextRenderContext: GridRenderContext,
  scrollCache: ScrollCache,
) {
  const [firstRowToRender, lastRowToRender] = getIndexesToRender({
    firstIndex: nextRenderContext.firstRowIndex,
    lastIndex: nextRenderContext.lastRowIndex,
    minFirstIndex: 0,
    maxLastIndex: inputs.rows.length,
    bufferBefore: scrollCache.buffer.rowBefore,
    bufferAfter: scrollCache.buffer.rowAfter,
    positions: inputs.rowsMeta.positions,
    lastSize: inputs.lastRowHeight,
  });

  const [initialFirstColumnToRender, lastColumnToRender] = getIndexesToRender({
    firstIndex: nextRenderContext.firstColumnIndex,
    lastIndex: nextRenderContext.lastColumnIndex,
    minFirstIndex: inputs.pinnedColumns.left.length,
    maxLastIndex: inputs.visibleColumns.length - inputs.pinnedColumns.right.length,
    bufferBefore: scrollCache.buffer.columnBefore,
    bufferAfter: scrollCache.buffer.columnAfter,
    positions: inputs.columnPositions,
    lastSize: inputs.lastColumnWidth,
  });

  const firstColumnToRender = getFirstNonSpannedColumnToRender({
    firstColumnToRender: initialFirstColumnToRender,
    apiRef: inputs.apiRef,
    firstRowToRender,
    lastRowToRender,
    visibleRows: inputs.rows,
  });

  return {
    firstRowIndex: firstRowToRender,
    lastRowIndex: lastRowToRender,
    firstColumnIndex: firstColumnToRender,
    lastColumnIndex: lastColumnToRender,
  };
}

type SearchOptions = {
  atStart: boolean;
  lastPosition: number;
};

/**
 * Use binary search to avoid looping through all possible positions.
 * The `options.atStart` provides the possibility to match for the first element that
 * intersects the screen, even if said element's start position is before `offset`. In
 * other words, we search for `offset + width`.
 */
function binarySearch(
  offset: number,
  positions: number[],
  options: SearchOptions | undefined = undefined,
  sliceStart = 0,
  sliceEnd = positions.length,
): number {
  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const position = positions[pivot];

  let isBefore: boolean;
  if (options?.atStart) {
    const width =
      (pivot === positions.length - 1 ? options.lastPosition : positions[pivot + 1]) - position;
    isBefore = offset - width < position;
  } else {
    isBefore = offset <= position;
  }

  return isBefore
    ? binarySearch(offset, positions, options, sliceStart, pivot)
    : binarySearch(offset, positions, options, pivot + 1, sliceEnd);
}

function exponentialSearch(
  offset: number,
  positions: number[],
  index: number,
  options: SearchOptions | undefined = undefined,
): number {
  let interval = 1;

  while (index < positions.length && Math.abs(positions[index]) < offset) {
    index += interval;
    interval *= 2;
  }

  return binarySearch(
    offset,
    positions,
    options,
    Math.floor(index / 2),
    Math.min(index, positions.length),
  );
}

function getIndexesToRender({
  firstIndex,
  lastIndex,
  bufferBefore,
  bufferAfter,
  minFirstIndex,
  maxLastIndex,
  positions,
  lastSize,
}: {
  firstIndex: number;
  lastIndex: number;
  bufferBefore: number;
  bufferAfter: number;
  minFirstIndex: number;
  maxLastIndex: number;
  positions: number[];
  lastSize: number;
}) {
  const firstPosition = positions[firstIndex] - bufferBefore;
  const lastPosition = positions[lastIndex] + bufferAfter;

  const firstIndexPadded = binarySearch(firstPosition, positions, {
    atStart: true,
    lastPosition: positions[positions.length - 1] + lastSize,
  });

  const lastIndexPadded = binarySearch(lastPosition, positions);

  return [
    clamp(firstIndexPadded, minFirstIndex, maxLastIndex),
    clamp(lastIndexPadded, minFirstIndex, maxLastIndex),
  ];
}

export function areRenderContextsEqual(context1: GridRenderContext, context2: GridRenderContext) {
  if (context1 === context2) {
    return true;
  }
  return (
    context1.firstRowIndex === context2.firstRowIndex &&
    context1.lastRowIndex === context2.lastRowIndex &&
    context1.firstColumnIndex === context2.firstColumnIndex &&
    context1.lastColumnIndex === context2.lastColumnIndex
  );
}

export function computeOffsetLeft(
  columnPositions: number[],
  renderContext: GridColumnsRenderContext,
  pinnedLeftLength: number,
) {
  const left =
    (columnPositions[renderContext.firstColumnIndex] ?? 0) -
    (columnPositions[pinnedLeftLength] ?? 0);
  return Math.abs(left);
}

function directionForDelta(dx: number, dy: number) {
  if (dx === 0 && dy === 0) {
    return ScrollDirection.NONE;
  }
  /* eslint-disable */
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy > 0) {
      return ScrollDirection.DOWN;
    } else {
      return ScrollDirection.UP;
    }
  } else {
    if (dx > 0) {
      return ScrollDirection.RIGHT;
    } else {
      return ScrollDirection.LEFT;
    }
  }
  /* eslint-enable */
}

function bufferForDirection(
  isRtl: boolean,
  direction: ScrollDirection,
  rowBufferPx: number,
  columnBufferPx: number,
  verticalBuffer: number,
  horizontalBuffer: number,
) {
  if (isRtl) {
    switch (direction) {
      case ScrollDirection.LEFT:
        direction = ScrollDirection.RIGHT;
        break;
      case ScrollDirection.RIGHT:
        direction = ScrollDirection.LEFT;
        break;
      default:
    }
  }

  switch (direction) {
    case ScrollDirection.NONE:
      return {
        rowAfter: rowBufferPx,
        rowBefore: rowBufferPx,
        columnAfter: columnBufferPx,
        columnBefore: columnBufferPx,
      };
    case ScrollDirection.LEFT:
      return {
        rowAfter: 0,
        rowBefore: 0,
        columnAfter: 0,
        columnBefore: horizontalBuffer,
      };
    case ScrollDirection.RIGHT:
      return {
        rowAfter: 0,
        rowBefore: 0,
        columnAfter: horizontalBuffer,
        columnBefore: 0,
      };
    case ScrollDirection.UP:
      return {
        rowAfter: 0,
        rowBefore: verticalBuffer,
        columnAfter: 0,
        columnBefore: 0,
      };
    case ScrollDirection.DOWN:
      return {
        rowAfter: verticalBuffer,
        rowBefore: 0,
        columnAfter: 0,
        columnBefore: 0,
      };
    default:
      // eslint unable to figure out enum exhaustiveness
      throw new Error('unreachable');
  }
}
