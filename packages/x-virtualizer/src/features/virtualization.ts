'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLazyRef from '@mui/utils/useLazyRef';
import useTimeout from '@mui/utils/useTimeout';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { integer, RefObject } from '@mui/x-internals/types';
import * as platform from '@mui/x-internals/platform';
import { useRunOnce } from '@mui/x-internals/useRunOnce';
import { useFirstRender } from '@mui/x-internals/useFirstRender';
import { createSelector, useSelector, useSelectorEffect, Store } from '@mui/x-internals/store';
import { Dimensions } from './dimensions';
import type { BaseState, VirtualizerParams } from '../useVirtualizer';
import {
  PinnedRowPosition,
  RenderContext,
  ColumnsRenderContext,
  ColumnWithWidth,
  RowId,
  RowEntry,
  ScrollPosition,
  ScrollDirection,
} from '../models';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const MINIMUM_COLUMN_WIDTH = 50;

export type VirtualizationState = {
  enabled: boolean;
  enabledForRows: boolean;
  enabledForColumns: boolean;
  renderContext: RenderContext;
};

const EMPTY_SCROLL_POSITION = { top: 0, left: 0 };

const EMPTY_DETAIL_PANELS = Object.freeze(new Map<RowId, React.ReactNode>());

export const EMPTY_RENDER_CONTEXT = {
  firstRowIndex: 0,
  lastRowIndex: 0,
  firstColumnIndex: 0,
  lastColumnIndex: 0,
};

const selectors = {
  renderContext: createSelector((state: BaseState) => state.virtualization.renderContext),
  enabledForRows: createSelector((state: BaseState) => state.virtualization.enabledForRows),
  enabledForColumns: createSelector((state: BaseState) => state.virtualization.enabledForColumns),
};

export const Virtualization = {
  initialize: initializeState,
  use: useVirtualization,
  selectors,
};
export namespace Virtualization {
  export type State = {
    virtualization: VirtualizationState;
    getters: ReturnType<typeof useVirtualization>['getters'];
  };
  export type API = ReturnType<typeof useVirtualization>;
}

function initializeState(params: VirtualizerParams) {
  const state: Virtualization.State = {
    virtualization: {
      enabled: !platform.isJSDOM,
      enabledForRows: !platform.isJSDOM,
      enabledForColumns: !platform.isJSDOM,
      renderContext: EMPTY_RENDER_CONTEXT,
      ...params.initialState?.virtualization,
    },
    // FIXME: refactor once the state shape is settled
    getters: null as unknown as ReturnType<typeof useVirtualization>['getters'],
  };
  return state;
}

function useVirtualization(
  store: Store<BaseState>,
  params: VirtualizerParams,
  api: Dimensions.API & { calculateColSpan: any },
) {
  const {
    initialState,
    isRtl,
    rows,
    range,
    columns,
    pinnedRows,
    pinnedColumns,
    refs,
    hasColSpan,

    dimensions: { rowHeight, columnsTotalWidth },

    contentHeight,
    minimalContentHeight,
    autoHeight,

    onWheel,
    onTouchMove,
    onRenderContextChange,
    onScrollChange,

    focusedCell,
    rowBufferPx,
    columnBufferPx,

    scrollReset,

    fixme,
  } = params;

  const needsHorizontalScrollbar = useSelector(
    store,
    Dimensions.selectors.needsHorizontalScrollbar,
  );

  const hasBottomPinnedRows = pinnedRows.bottom.length > 0;
  const [panels, setPanels] = React.useState(EMPTY_DETAIL_PANELS);

  const isRenderContextReady = React.useRef(false);

  const renderContext = useSelector(store, selectors.renderContext);
  const enabledForRows = useSelector(store, selectors.enabledForRows);
  const enabledForColumns = useSelector(store, selectors.enabledForColumns);

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
  const scrollPosition = React.useRef(initialState?.scroll ?? EMPTY_SCROLL_POSITION);
  const ignoreNextScrollEvent = React.useRef(false);
  const previousContextScrollPosition = React.useRef(EMPTY_SCROLL_POSITION);
  const previousRowContext = React.useRef(EMPTY_RENDER_CONTEXT);

  const scrollTimeout = useTimeout();
  const frozenContext = React.useRef<RenderContext | undefined>(undefined);
  const scrollCache = useLazyRef(() =>
    createScrollCache(isRtl, rowBufferPx, columnBufferPx, rowHeight * 15, MINIMUM_COLUMN_WIDTH * 6),
  ).current;

  const updateRenderContext = React.useCallback(
    (nextRenderContext: RenderContext) => {
      if (areRenderContextsEqual(nextRenderContext, store.state.virtualization.renderContext)) {
        return;
      }

      const didRowsIntervalChange =
        nextRenderContext.firstRowIndex !== previousRowContext.current.firstRowIndex ||
        nextRenderContext.lastRowIndex !== previousRowContext.current.lastRowIndex;

      store.set('virtualization', {
        ...store.state.virtualization,
        renderContext: nextRenderContext,
      });

      // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
      // but only does something if we already have a render context, because
      // otherwise we would call an update directly on mount
      const isReady = Dimensions.selectors.dimensions(store.state).isReady;
      if (isReady && didRowsIntervalChange) {
        previousRowContext.current = nextRenderContext;
        onRenderContextChange?.(nextRenderContext);
      }

      previousContextScrollPosition.current = scrollPosition.current;
    },
    [onRenderContextChange],
  );

  const triggerUpdateRenderContext = useEventCallback(() => {
    const scroller = refs.scroller.current;
    if (!scroller) {
      return undefined;
    }

    const dimensions = Dimensions.selectors.dimensions(store.state);
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
      rowBufferPx,
      columnBufferPx,
      rowHeight * 15,
      MINIMUM_COLUMN_WIDTH * 6,
    );

    const inputs = fixme.inputs(enabledForRows, enabledForColumns);
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);

    if (!areRenderContextsEqual(nextRenderContext, renderContext)) {
      // Prevents batching render context changes
      ReactDOM.flushSync(() => {
        updateRenderContext(nextRenderContext);
      });

      scrollTimeout.start(1000, triggerUpdateRenderContext);
    }

    return nextRenderContext;
  });

  const forceUpdateRenderContext = () => {
    // skip update if dimensions are not ready and virtualization is enabled
    if (
      !Dimensions.selectors.dimensions(store.state).isReady &&
      (enabledForRows || enabledForColumns)
    ) {
      return;
    }
    const inputs = fixme.inputs(enabledForRows, enabledForColumns);
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
    if (nextRenderContext) {
      onScrollChange?.(scrollPosition.current, nextRenderContext);
    }
  });

  /**
   * HACK: unstable_rowTree fixes the issue described below, but does it by tightly coupling this
   * section of code to the DataGrid's rowTree model. The `unstable_rowTree` param is a temporary
   * solution to decouple the code.
   */
  const getRows = (
    params: {
      rows?: RowEntry[];
      position?: PinnedRowPosition;
      renderContext?: RenderContext;
    } = {},
    unstable_rowTree: Record<RowId, any>,
  ) => {
    if (!params.rows && !range) {
      return [];
    }

    let baseRenderContext = renderContext;
    if (params.renderContext) {
      baseRenderContext = params.renderContext as RenderContext;

      baseRenderContext.firstColumnIndex = renderContext.firstColumnIndex;
      baseRenderContext.lastColumnIndex = renderContext.lastColumnIndex;
    }

    const isLastSection =
      (!hasBottomPinnedRows && params.position === undefined) ||
      (hasBottomPinnedRows && params.position === 'bottom');
    const isPinnedSection = params.position !== undefined;

    let rowIndexOffset: number;
    switch (params.position) {
      case 'top':
        rowIndexOffset = 0;
        break;
      case 'bottom':
        rowIndexOffset = pinnedRows.top.length + rows.length;
        break;
      case undefined:
      default:
        rowIndexOffset = pinnedRows.top.length;
        break;
    }

    const rowModels = params.rows ?? rows;

    const firstRowToRender = baseRenderContext.firstRowIndex;
    const lastRowToRender = Math.min(baseRenderContext.lastRowIndex, rowModels.length);

    const rowIndexes = params.rows
      ? createRange(0, params.rows.length)
      : createRange(firstRowToRender, lastRowToRender);

    let virtualRowIndex = -1;
    if (!isPinnedSection && focusedCell) {
      if (focusedCell.rowIndex < firstRowToRender) {
        rowIndexes.unshift(focusedCell.rowIndex);
        virtualRowIndex = focusedCell.rowIndex;
      }
      if (focusedCell.rowIndex > lastRowToRender) {
        rowIndexes.push(focusedCell.rowIndex);
        virtualRowIndex = focusedCell.rowIndex;
      }
    }

    const rowElements: React.ReactNode[] = [];
    const columnPositions = Dimensions.selectors.columnPositions(store.state, columns);

    rowIndexes.forEach((rowIndexInPage) => {
      const { id, model } = rowModels[rowIndexInPage];

      // In certain cases, the state might already be updated and `params.rows` (which sets `rowModels`)
      // contains stale data.
      // In that case, skip any further row processing.
      // See:
      // - https://github.com/mui/mui-x/issues/16638
      // - https://github.com/mui/mui-x/issues/17022
      if (!unstable_rowTree[id]) {
        return;
      }

      const rowIndex = (range?.firstRowIndex || 0) + rowIndexOffset + rowIndexInPage;

      // NOTE: This is an expensive feature, the colSpan code could be optimized.
      if (hasColSpan) {
        const minFirstColumn = pinnedColumns.left.length;
        const maxLastColumn = columns.length - pinnedColumns.right.length;

        api.calculateColSpan(id, minFirstColumn, maxLastColumn, columns);

        if (pinnedColumns.left.length > 0) {
          api.calculateColSpan(id, 0, pinnedColumns.left.length, columns);
        }

        if (pinnedColumns.right.length > 0) {
          api.calculateColSpan(
            id,
            columns.length - pinnedColumns.right.length,
            columns.length,
            columns,
          );
        }
      }

      const baseRowHeight = !api.rowsMeta.rowHasAutoHeight(id)
        ? api.rowsMeta.getRowHeight(id)
        : 'auto';

      let isFirstVisible = false;
      if (params.position === undefined) {
        isFirstVisible = rowIndexInPage === 0;
      }

      let isLastVisible = false;
      const isLastVisibleInSection = rowIndexInPage === rowModels.length - 1;
      if (isLastSection) {
        if (!isPinnedSection) {
          const lastIndex = rows.length - 1;
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
      const isVirtualFocusColumn = focusedCell?.rowIndex === rowIndex;

      const offsetLeft = computeOffsetLeft(
        columnPositions,
        currentRenderContext,
        pinnedColumns.left.length,
      );
      const showBottomBorder = isLastVisibleInSection && params.position === 'top';

      const firstColumnIndex = currentRenderContext.firstColumnIndex;
      const lastColumnIndex = currentRenderContext.lastColumnIndex;

      rowElements.push(
        fixme.renderRow({
          id,
          model,
          rowIndex,
          offsetLeft,
          columnsTotalWidth,
          baseRowHeight,
          columns,
          firstColumnIndex,
          lastColumnIndex,
          focusedColumnIndex: isVirtualFocusColumn ? focusedCell!.columnIndex : undefined,
          isFirstVisible,
          isLastVisible,
          isVirtualFocusRow,
          showBottomBorder,
        }),
      );

      if (isVirtualFocusRow) {
        return;
      }

      const panel = panels.get(id);
      if (panel) {
        rowElements.push(panel);
      }
      if (params.position === undefined && isLastVisibleInSection) {
        rowElements.push(fixme.renderInfiniteLoadingTrigger(id));
      }
    });
    return rowElements;
  };

  const scrollerStyle = React.useMemo(
    () =>
      ({
        overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
        overflowY: autoHeight ? 'hidden' : undefined,
      }) as React.CSSProperties,
    [needsHorizontalScrollbar, autoHeight],
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

  const verticalScrollRestoreCallback = React.useRef<Function | null>(null);
  const onContentSizeApplied = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return;
      }
      verticalScrollRestoreCallback.current?.(columnsTotalWidth, contentHeight);
    },
    [columnsTotalWidth, contentHeight],
  );

  /**
   * Calculate `colSpan` for each cell in the row.
   * Placeholder API for colspan to re-implement.
   */
  const calculateColSpan = (
    _rowId: RowId,
    _minFirstColumn: integer,
    _maxLastColumn: integer,
    _columns: ColumnWithWidth[],
  ): void => {
    throw new Error('Unimplemented: colspan feature is required');
  };

  useEnhancedEffect(() => {
    if (!isRenderContextReady.current) {
      return;
    }
    forceUpdateRenderContext();
  }, [enabledForColumns, enabledForRows]);

  useEnhancedEffect(() => {
    if (refs.scroller.current) {
      refs.scroller.current.scrollLeft = 0;
    }
  }, [refs.scroller, scrollReset]);

  useRunOnce(renderContext !== EMPTY_RENDER_CONTEXT, () => {
    onScrollChange?.(scrollPosition.current, renderContext);

    isRenderContextReady.current = true;

    if (initialState?.scroll && refs.scroller.current) {
      const scroller = refs.scroller.current;
      const { top, left } = initialState.scroll;

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
        verticalScrollRestoreCallback.current = (
          columnsTotalWidth: number,
          contentHeight: number,
        ) => {
          if (!isScrollRestored.left && columnsTotalWidth) {
            scroller.scrollLeft = left;
            ignoreNextScrollEvent.current = true;
            isScrollRestored.left = true;
          }
          if (!isScrollRestored.top && contentHeight) {
            scroller.scrollTop = top;
            ignoreNextScrollEvent.current = true;
            isScrollRestored.top = true;
          }
          if (isScrollRestored.left && isScrollRestored.top) {
            verticalScrollRestoreCallback.current = null;
          }
        };
      }
    }
  });

  useSelectorEffect(store, Dimensions.selectors.dimensions, forceUpdateRenderContext);

  const getters = {
    setPanels,
    getRows,
    getContainerProps: () => ({
      ref: params.refs.container,
    }),
    getScrollerProps: () => ({
      ref: refs.scroller,
      onScroll: handleScroll,
      onWheel,
      onTouchMove,
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
      ref: refs.scrollbarVertical,
      scrollPosition,
    }),
    getScrollbarHorizontalProps: () => ({
      ref: refs.scrollbarHorizontal,
      scrollPosition,
    }),
    getScrollAreaProps: () => ({
      scrollPosition,
    }),
  };

  useFirstRender(() => {
    store.state = {
      ...store.state,
      getters,
    };
  });
  React.useEffect(() => {
    store.update({ ...store.state, getters });
  }, Object.values(getters));

  return {
    getters,
    useVirtualization: () => useSelector(store, (state) => state),
    setPanels,
    forceUpdateRenderContext,
    calculateColSpan,
  };
}

type RenderContextInputs = any;
// type RenderContextInputs = {
//   enabledForRows: boolean;
//   enabledForColumns: boolean;
//   apiRef: RefObject<any>;
//   autoHeight: boolean;
//   rowBufferPx: number;
//   columnBufferPx: number;
//   leftPinnedWidth: number;
//   columnsTotalWidth: number;
//   viewportInnerWidth: number;
//   viewportInnerHeight: number;
//   lastRowHeight: number;
//   lastColumnWidth: number;
//   rowsMeta: ReturnType<typeof gridRowsMetaSelector>;
//   columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
//   rows: ReturnType<typeof useGridVisibleRows>['rows'];
//   range: ReturnType<typeof useGridVisibleRows>['range'];
//   pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;
//   columns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>;
//   hiddenCellsOriginMap: ReturnType<typeof gridRowSpanningHiddenCellsOriginMapSelector>;
//   listView: boolean;
//   virtualizeColumnsWithAutoRowHeight: DataGridProcessedProps['virtualizeColumnsWithAutoRowHeight'];
// };

function computeRenderContext(
  inputs: RenderContextInputs,
  scrollPosition: ScrollPosition,
  scrollCache: ScrollCache,
) {
  const renderContext: RenderContext = {
    firstRowIndex: 0,
    lastRowIndex: inputs.rows.length,
    firstColumnIndex: 0,
    lastColumnIndex: inputs.columns.length,
  };

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
      const minSpannedRowIndex = Math.min(...(Object.values(rowSpanHiddenCellOrigin) as any));
      firstRowIndex = Math.min(firstRowIndex, minSpannedRowIndex);
    }

    const lastRowIndex = inputs.autoHeight
      ? firstRowIndex + inputs.rows.length
      : getNearestIndexToRender(inputs, top + inputs.viewportInnerHeight);

    renderContext.firstRowIndex = firstRowIndex;
    renderContext.lastRowIndex = lastRowIndex;
  }

  if (inputs.listView) {
    return {
      ...renderContext,
      lastColumnIndex: 1,
    };
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
  nextRenderContext: RenderContext,
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
    maxLastIndex: inputs.columns.length - inputs.pinnedColumns.right.length,
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

export function areRenderContextsEqual(context1: RenderContext, context2: RenderContext) {
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
  renderContext: ColumnsRenderContext,
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

function createScrollCache(
  isRtl: boolean,
  rowBufferPx: number,
  columnBufferPx: number,
  verticalBuffer: number,
  horizontalBuffer: number,
) {
  return {
    direction: ScrollDirection.NONE,
    buffer: bufferForDirection(
      isRtl,
      ScrollDirection.NONE,
      rowBufferPx,
      columnBufferPx,
      verticalBuffer,
      horizontalBuffer,
    ),
  };
}
type ScrollCache = ReturnType<typeof createScrollCache>;

function createRange(from: number, to: number) {
  return Array.from({ length: to - from }).map((_, i) => from + i);
}

function getFirstNonSpannedColumnToRender({
  firstColumnToRender,
  apiRef,
  firstRowToRender,
  lastRowToRender,
  visibleRows,
}: {
  firstColumnToRender: number;
  apiRef: RefObject<any>;
  firstRowToRender: number;
  lastRowToRender: number;
  visibleRows: RowEntry[];
}) {
  let firstNonSpannedColumnToRender = firstColumnToRender;
  let foundStableColumn = false;

  // Keep checking columns until we find one that's not spanned in any visible row
  while (!foundStableColumn && firstNonSpannedColumnToRender >= 0) {
    foundStableColumn = true;

    for (let i = firstRowToRender; i < lastRowToRender; i += 1) {
      const row = visibleRows[i];
      if (row) {
        const rowId = visibleRows[i].id;
        const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
          rowId,
          firstNonSpannedColumnToRender,
        );

        if (
          cellColSpanInfo &&
          cellColSpanInfo.spannedByColSpan &&
          cellColSpanInfo.leftVisibleCellIndex < firstNonSpannedColumnToRender
        ) {
          firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
          foundStableColumn = false;
          break; // Check the new column index against the visible rows, because it might be spanned
        }
      }
    }
  }

  return firstNonSpannedColumnToRender;
}

export function roundToDecimalPlaces(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
