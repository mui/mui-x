'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLazyRef from '@mui/utils/useLazyRef';
import useTimeout from '@mui/utils/useTimeout';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { integer } from '@mui/x-internals/types';
import { platform } from '@base-ui/utils/platform';
import { useRunOnce } from '@mui/x-internals/useRunOnce';
import { createSelector, useStore, useStoreEffect, Store } from '@mui/x-internals/store';
import useRefCallback from '../../utils/useRefCallback';
import { PinnedRows, PinnedColumns, Size } from '../../models/core';
import type { CellColSpanInfo } from '../../models/colspan';
import { Dimensions, observeRootNode } from '../dimensions';
import type { BaseState, ParamsWithDefaults } from '../../useVirtualizer';
import type { Layout } from './layout';
import { nextAnchorTop } from './anchor';
import {
  PinnedRowPosition,
  RenderContext,
  ColumnsRenderContext,
  ColumnWithWidth,
  RowId,
  RowEntry,
  ScrollPosition,
  ScrollDirection,
} from '../../models';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const MINIMUM_COLUMN_WIDTH = 50;

// For fast scrolls with inverse sticky, delay the rendering by certain number of frames
// to give time for the entering rows to rasterize. Below the lowest threshold, updates commit
// immediately. Ordered by descending speed - the first match wins.
const SCROLL_DELAY_LEVELS: ReadonlyArray<{ minVelocityPxPerMs: number; frames: number }> = [
  { minVelocityPxPerMs: 24, frames: 6 },
  { minVelocityPxPerMs: 20, frames: 4 },
  { minVelocityPxPerMs: 16, frames: 2 },
  { minVelocityPxPerMs: 8, frames: 1 },
];

function scrollDelayFrames(velocityPxPerMs: number): number {
  for (const level of SCROLL_DELAY_LEVELS) {
    if (velocityPxPerMs >= level.minVelocityPxPerMs) {
      return level.frames;
    }
  }
  return 0;
}

export type VirtualizationParams = {
  /** @default false */
  isRtl?: boolean;
  /** The row buffer in pixels to render before and after the viewport.
   * @default 150 */
  rowBufferPx?: number;
  /** The column buffer in pixels to render before and after the viewport.
   * @default 150 */
  columnBufferPx?: number;
  /**
   * Controls how the container and render zones are positioned:
   * - 'uncontrolled': uses CSS sticky positioning (default)
   * - 'controlled': uses CSS absolute positioning with JS-computed offsets
   * - 'sticky': inverse-sticky positioning on both axes (native scrolling within the
   *   directional buffers, clamping to stale content instead of blanking beyond them)
   * @default 'uncontrolled'
   */
  layoutMode?: 'controlled' | 'uncontrolled' | 'sticky';
};

export type VirtualizationState<K extends string = string> = {
  enabled: boolean;
  enabledForRows: boolean;
  enabledForColumns: boolean;
  renderContext: RenderContext;
  props: Record<K, Record<string, any>>;
  context: Record<string, any>;
  scrollPosition: { current: ScrollPosition };
  layoutMode: 'controlled' | 'uncontrolled' | 'sticky';
  anchorTop: number;
};

const EMPTY_SCROLL_POSITION = { top: 0, left: 0 };

const EMPTY_DETAIL_PANELS = Object.freeze(new Map<RowId, React.ReactNode>());

export const EMPTY_RENDER_CONTEXT = {
  firstRowIndex: 0,
  lastRowIndex: 0,
  firstColumnIndex: 0,
  lastColumnIndex: 0,
};

const selectors = (() => {
  const firstRowIndexSelector = createSelector(
    (state: BaseState) => state.virtualization.renderContext.firstRowIndex,
  );
  const scrollPositionSelector = createSelector(
    (state: BaseState) => state.virtualization.scrollPosition,
  );
  const layoutModeSelector = createSelector((state: BaseState) => state.virtualization.layoutMode);

  return {
    store: createSelector((state: BaseState) => state.virtualization),
    renderContext: createSelector((state: BaseState) => state.virtualization.renderContext),
    enabledForRows: createSelector((state: BaseState) => state.virtualization.enabledForRows),
    enabledForColumns: createSelector((state: BaseState) => state.virtualization.enabledForColumns),
    offsetTop: createSelector(
      layoutModeSelector,
      Dimensions.selectors.dimensions,
      Dimensions.selectors.rowPositions,
      firstRowIndexSelector,
      (layoutMode, dimensions, rowPositions, firstRowIndex) => {
        return (
          (layoutMode === 'uncontrolled' ? dimensions.topContainerHeight : 0) +
          (rowPositions[firstRowIndex] ?? 0)
        );
      },
    ),
    context: createSelector((state: BaseState) => state.virtualization.context),
    anchorTop: createSelector((state: BaseState) => state.virtualization.anchorTop),
    layoutMode: layoutModeSelector,
    scrollPosition: scrollPositionSelector,
    pinnedLeftOffsetSelector: createSelector(
      scrollPositionSelector,
      (scrollPosition) => scrollPosition.current.left,
    ),
    pinnedRightOffsetSelector: createSelector(
      scrollPositionSelector,
      Dimensions.selectors.dimensions,
      Dimensions.selectors.columnsTotalWidth,
      Dimensions.selectors.needsVerticalScrollbar,
      (scrollPosition, dimensions, columnsTotalWidth, needsVerticalScrollbar) => {
        return (
          Math.max(columnsTotalWidth, dimensions.viewportOuterSize.width) -
          dimensions.viewportOuterSize.width -
          scrollPosition.current.left +
          (needsVerticalScrollbar ? dimensions.scrollbarSize : 0)
        );
      },
    ),
  };
})();

export const Virtualization = {
  initialize: initializeState,
  use: useVirtualization,
  selectors,
};
export namespace Virtualization {
  export type State<L extends Layout> = {
    virtualization: VirtualizationState<L extends Layout<infer E> ? keyof E : string>;
    getters: ReturnType<typeof useVirtualization>['getters'];
  };
  export type API = ReturnType<typeof useVirtualization>;
}

function initializeState(params: ParamsWithDefaults) {
  const { enabled, enabledForRows, enabledForColumns } = params.initialState?.virtualization ?? {};

  // When virtualization is fully disabled, pre-compute the render context to
  // cover all rows/columns. This matches what `computeRenderContext` returns
  // for the disabled case, so the first `forceUpdateRenderContext` after mount
  // detects no change and skips the store notification, which avoids a nested
  // re-render.
  const renderContext =
    enabled === false && enabledForRows === false && enabledForColumns === false
      ? {
          firstRowIndex: 0,
          lastRowIndex: params.rows.length,
          firstColumnIndex: 0,
          lastColumnIndex: params.columns?.length ?? 0,
        }
      : EMPTY_RENDER_CONTEXT;

  const state: Virtualization.State<typeof params.layout> = {
    virtualization: {
      enabled: !platform.env.jsdom,
      enabledForRows: !platform.env.jsdom,
      enabledForColumns: !platform.env.jsdom,
      renderContext,
      props: (params.layout.constructor as typeof Layout).elements.reduce(
        (acc, key) => (acc[key as string], acc),
        {} as Record<string, Record<string, any>>,
      ),
      context: {},
      scrollPosition: { current: ScrollPosition.EMPTY },
      layoutMode: params.virtualization.layoutMode ?? 'uncontrolled',
      anchorTop: 0,
      ...params.initialState?.virtualization,
    },
    // FIXME: refactor once the state shape is settled
    getters: null as unknown as ReturnType<typeof useVirtualization>['getters'],
  };
  return state;
}

/** APIs to override for colspan/rowspan */
type AbstractAPI = {
  getCellColSpanInfo: (rowId: RowId, columnIndex: integer) => CellColSpanInfo;
  calculateColSpan: (
    rowId: RowId,
    minFirstColumn: integer,
    maxLastColumn: integer,
    columns: ColumnWithWidth[],
  ) => void;
  getHiddenCellsOrigin: () => Record<RowId, Record<number, number>>;
};

type RequiredAPI = Dimensions.API & AbstractAPI;

export type VirtualizationLayoutParams = {
  containerRef: (node: HTMLDivElement | null) => void;
  scrollerRef: (node: HTMLDivElement | null) => void;
};

function useVirtualization(store: Store<BaseState>, params: ParamsWithDefaults, api: RequiredAPI) {
  const {
    layout,
    dimensions: { rowHeight, columnsTotalWidth = 0 },
    virtualization: { isRtl = false, rowBufferPx = 150, columnBufferPx = 150 },
    colspan,
    initialState,
    rows,
    range,
    columns,
    pinnedRows = PinnedRows.EMPTY,
    pinnedColumns = PinnedColumns.EMPTY,

    onWheel,
    onTouchMove,
    onRenderContextChange,
    onScrollChange,

    scrollReset,

    renderRow,
    renderInfiniteLoadingTrigger,
  } = params;

  const hasBottomPinnedRows = pinnedRows.bottom.length > 0;
  const [panels, setPanels] = React.useState(EMPTY_DETAIL_PANELS);
  const isUpdateScheduled = React.useRef(false);

  const isRenderContextReady = React.useRef(false);

  const renderContext = useStore(store, selectors.renderContext);
  const enabledForRows = useStore(store, selectors.enabledForRows);
  const enabledForColumns = useStore(store, selectors.enabledForColumns);
  const layoutMode = useStore(store, selectors.layoutMode);

  const contentHeight = useStore(store, Dimensions.selectors.contentHeight);

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
  // Frames deferral of sticky render-context advances during fast scroll
  const deferredStickyFrame = React.useRef(0);
  const deferredFramesRemaining = React.useRef(0);
  const forceStickyCommit = React.useRef(false);
  const lastScrollTimestamp = React.useRef(0);
  React.useEffect(
    () => () => {
      if (deferredStickyFrame.current !== 0) {
        cancelAnimationFrame(deferredStickyFrame.current);
      }
    },
    [],
  );
  const scrollCache = useLazyRef(() =>
    createScrollCache(
      isRtl,
      rowBufferPx,
      columnBufferPx,
      averageRowHeight(store, rowHeight) * 15,
      MINIMUM_COLUMN_WIDTH * 6,
      layoutMode,
    ),
  ).current;

  /**
   * Re-derives the buffers for `direction`. The buffers depend on the measured row
   * height, so they are refreshed whenever the render context is recomputed, not
   * only on a direction change: rows are usually measured after the first buffer is
   * created, and in sticky mode a buffer that changes size once scrolling has started
   * resizes the window layer at the worst possible moment.
   */
  const updateScrollCacheBuffer = (direction: ScrollDirection) => {
    scrollCache.direction = direction;
    scrollCache.buffer = bufferForDirection(
      isRtl,
      direction,
      rowBufferPx,
      columnBufferPx,
      averageRowHeight(store, rowHeight) * 15,
      MINIMUM_COLUMN_WIDTH * 6,
      layoutMode,
    );
  };

  const updateRenderContext = React.useCallback(
    (nextRenderContext: RenderContext, nextAnchor?: number) => {
      const state = store.state.virtualization;
      // Callers that don't pass an anchor (dimension and data changes) can run in the
      // middle of a scroll, so they hold it: only the pass that observes a settled
      // scroll re-quantizes, and `anchorTopFor` still re-anchors when it must.
      const anchorTop =
        nextAnchor ?? anchorTopFor(store, state.layoutMode, nextRenderContext, false);

      if (
        !areRenderContextsEqual(nextRenderContext, state.renderContext) ||
        anchorTop !== state.anchorTop
      ) {
        store.set('virtualization', {
          ...state,
          renderContext: nextRenderContext,
          anchorTop,
          scrollPosition: { current: { ...scrollPosition.current } },
        });
      }

      // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
      // but only does something if we already have a render context, because
      // otherwise we would call an update directly on mount
      const isReady = Dimensions.selectors.dimensions(store.state).isReady;
      const didRowsIntervalChange =
        nextRenderContext.firstRowIndex !== previousRowContext.current.firstRowIndex ||
        nextRenderContext.lastRowIndex !== previousRowContext.current.lastRowIndex;

      if (isReady && didRowsIntervalChange) {
        previousRowContext.current = nextRenderContext;
        onRenderContextChange?.(nextRenderContext);
      }

      previousContextScrollPosition.current = scrollPosition.current;
    },
    [store, onRenderContextChange],
  );

  // `isSettlePass` marks the run scheduled by the scroll timeout below. It is the only
  // caller that knows the scroll stopped: a scroll event carrying no movement is not a
  // reliable signal, since writing `scrollTop` also echoes one back.
  const triggerUpdateRenderContext = useEventCallback((isSettlePass: boolean = false) => {
    const scroller = layout.refs.scroller.current;
    if (!scroller) {
      return undefined;
    }

    const dimensions = Dimensions.selectors.dimensions(store.state);
    const maxScrollTop = Math.ceil(
      dimensions.contentSize.height - dimensions.viewportInnerSize.height,
    );
    const maxScrollLeft = Math.ceil(
      dimensions.contentSize.width - dimensions.viewportInnerSize.width,
    );

    // Clamp the scroll position to the viewport to avoid re-calculating the render context for scroll bounce
    const newScroll = {
      top: clamp(scroller.scrollTop, 0, maxScrollTop),
      left: isRtl
        ? clamp(scroller.scrollLeft, -Math.abs(maxScrollLeft), 0)
        : clamp(scroller.scrollLeft, 0, maxScrollLeft),
    };

    const dx = newScroll.left - scrollPosition.current.left;
    const dy = newScroll.top - scrollPosition.current.top;

    const now = performance.now();
    const dtSinceLastScroll = now - lastScrollTimestamp.current;
    lastScrollTimestamp.current = now;
    // a long gap (new gesture) or the first event must not read as fast.
    const rowVelocity =
      dtSinceLastScroll > 0 && dtSinceLastScroll < 100 ? Math.abs(dy) / dtSinceLastScroll : 0;

    const isScrolling = dx !== 0 || dy !== 0;

    scrollPosition.current = newScroll;

    const direction = isScrolling ? ScrollDirection.forDelta(dx, dy) : ScrollDirection.NONE;

    const didChangeDirection = scrollCache.direction !== direction;

    // Moving the anchor of the paint-stable window content re-rasterizes the whole
    // window, so it is held while the scroll is moving and re-quantized here, with
    // nothing moving to expose the raster. The position is checked alongside the settle
    // pass: the timeout may well have elapsed while a slow scroll is still going.
    const isSettled = isSettlePass && direction === ScrollDirection.NONE;

    let shouldUpdate: boolean;
    if (layoutMode === 'sticky') {
      // In sticky mode, a render context update re-renders the window's row set and
      // rasterizes the entering rows. Updating on every crossed
      // row would spend a main-thread render + commit per row. Defer updates until
      // half of a buffer is consumed instead. The inverse-sticky clamp covers any
      // overshoot with stale content in the meantime.
      shouldUpdate =
        didChangeDirection ||
        isLowOnRenderedBuffer(store, params, scrollPosition.current, scrollCache);
    } else {
      // Since previous render, we have scrolled...
      const rowScroll = Math.abs(
        scrollPosition.current.top - previousContextScrollPosition.current.top,
      );
      const columnScroll = Math.abs(
        scrollPosition.current.left - previousContextScrollPosition.current.left,
      );

      // PERF: use the computed minimum column width instead of a static one
      const didCrossThreshold =
        rowScroll >= averageRowHeight(store, rowHeight) || columnScroll >= MINIMUM_COLUMN_WIDTH;
      shouldUpdate = didCrossThreshold || didChangeDirection;
    }

    if (!shouldUpdate) {
      store.set('virtualization', {
        ...store.state.virtualization,
        anchorTop: anchorTopFor(store, layoutMode, renderContext, isSettled),
        scrollPosition: { current: { ...scrollPosition.current } },
      });
      return renderContext;
    }

    // Fast sticky scroll: show the current (stale) window and defer the advance by a
    // velocity-dependent number of animation frames, giving the entering rows that
    // many frames to rasterize before the viewport reveals them. Direction changes
    // (which reallocate the buffer) and the settle pass always commit immediately; a
    // deferral in flight re-enters with `forceStickyCommit` set, so at most one commit
    // runs per deferral window, always for the latest scroll position.
    const isDeferralPending = deferredStickyFrame.current !== 0;
    if (
      layoutMode === 'sticky' &&
      !forceStickyCommit.current &&
      !didChangeDirection &&
      !isSettlePass &&
      (isDeferralPending || scrollDelayFrames(rowVelocity) > 0)
    ) {
      if (!isDeferralPending) {
        deferredFramesRemaining.current = scrollDelayFrames(rowVelocity);
        const advanceOneFrame = () => {
          deferredFramesRemaining.current -= 1;
          if (deferredFramesRemaining.current > 0) {
            deferredStickyFrame.current = requestAnimationFrame(advanceOneFrame);
            return;
          }
          deferredStickyFrame.current = 0;
          forceStickyCommit.current = true;
          try {
            triggerUpdateRenderContext(false);
          } finally {
            forceStickyCommit.current = false;
          }
        };
        deferredStickyFrame.current = requestAnimationFrame(advanceOneFrame);
      }
      store.set('virtualization', {
        ...store.state.virtualization,
        anchorTop: anchorTopFor(store, layoutMode, renderContext, isSettled),
        scrollPosition: { current: { ...scrollPosition.current } },
      });
      return renderContext;
    }

    // Committing now (direction change, settle, or slow scroll): drop any deferral
    // still counting down so it can't fire a redundant commit afterward.
    if (deferredStickyFrame.current !== 0) {
      cancelAnimationFrame(deferredStickyFrame.current);
      deferredStickyFrame.current = 0;
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
          // The frozen context pins carried-over rows to their pre-scroll (wider)
          // column range so they don't re-render when the buffers narrow for the
          // scroll duration. In sticky mode all rows share the window's single column
          // offset (the flex spacer), so a row carrying an independent column range
          // would be misaligned from the window; freezing is disabled.
          frozenContext.current = layoutMode === 'sticky' ? undefined : renderContext;
          break;
      }
    }

    updateScrollCacheBuffer(direction);

    const inputs = inputsSelector(
      store,
      params,
      api,
      enabledForRows,
      enabledForColumns,
      layoutMode,
    );
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);

    const nextAnchor = anchorTopFor(store, layoutMode, nextRenderContext, isSettled);

    if (!areRenderContextsEqual(nextRenderContext, renderContext)) {
      // Prevents batching render context changes
      ReactDOM.flushSync(() => {
        updateRenderContext(nextRenderContext, nextAnchor);
      });

      if (layoutMode !== 'controlled') {
        scrollTimeout.start(1000, () => triggerUpdateRenderContext(true));
      }
    } else {
      store.set('virtualization', {
        ...store.state.virtualization,
        anchorTop: nextAnchor,
        scrollPosition: { current: { ...scrollPosition.current } },
      });
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
    // Rows may have been measured or replaced since the buffers were last derived.
    updateScrollCacheBuffer(scrollCache.direction);
    const inputs = inputsSelector(
      store,
      params,
      api,
      enabledForRows,
      enabledForColumns,
      layoutMode,
    );
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);
    // Reset the frozen context when the render context changes, see the illustration in https://github.com/mui/mui-x/pull/12353
    frozenContext.current = undefined;
    updateRenderContext(nextRenderContext);
  };

  const forceUpdateRenderContextCallback = useEventCallback(forceUpdateRenderContext);

  useStoreEffect(store, Dimensions.selectors.dimensions, (previous, next) => {
    if (next.isReady) {
      forceUpdateRenderContext();
    }
  });

  useEnhancedEffect(() => {
    if (isUpdateScheduled.current) {
      forceUpdateRenderContext();
      isUpdateScheduled.current = false;
    }
  });

  const scheduleUpdateRenderContext = () => {
    isUpdateScheduled.current = true;
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
    rowParams: {
      rows?: RowEntry[];
      position?: PinnedRowPosition;
      renderContext?: RenderContext;
    } = {},
    unstable_rowTree?: Record<RowId, any>,
  ) => {
    if (!rowParams.rows && !range) {
      return [];
    }

    let baseRenderContext = renderContext;
    if (rowParams.renderContext) {
      baseRenderContext = rowParams.renderContext as RenderContext;

      baseRenderContext.firstColumnIndex = renderContext.firstColumnIndex;
      baseRenderContext.lastColumnIndex = renderContext.lastColumnIndex;
    }

    const isLastSection =
      (!hasBottomPinnedRows && rowParams.position === undefined) ||
      (hasBottomPinnedRows && rowParams.position === 'bottom');
    const isPinnedSection = rowParams.position !== undefined;

    let rowIndexOffset: number;
    switch (rowParams.position) {
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

    const rowModels = rowParams.rows ?? rows;

    const firstRowToRender = baseRenderContext.firstRowIndex;
    const lastRowToRender = Math.min(baseRenderContext.lastRowIndex, rowModels.length);

    const rowIndexes = rowParams.rows
      ? createRange(0, rowParams.rows.length)
      : createRange(firstRowToRender, lastRowToRender);

    let virtualRowIndex = -1;
    const focusedVirtualCell = params.focusedVirtualCell?.();
    if (!isPinnedSection && focusedVirtualCell) {
      if (
        focusedVirtualCell.rowIndex < firstRowToRender &&
        focusedVirtualCell.rowIndex >= 0 &&
        focusedVirtualCell.rowIndex < rowModels.length
      ) {
        rowIndexes.unshift(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
      }
      if (
        focusedVirtualCell.rowIndex > lastRowToRender &&
        focusedVirtualCell.rowIndex < rowModels.length
      ) {
        rowIndexes.push(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
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
      if (unstable_rowTree && !unstable_rowTree[id]) {
        return;
      }

      const rowIndex = (range?.firstRowIndex || 0) + rowIndexOffset + rowIndexInPage;

      // NOTE: This is an expensive feature, the colSpan code could be optimized.
      if (colspan?.enabled) {
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
      if (rowParams.position === undefined) {
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
      const isVirtualFocusColumn = focusedVirtualCell?.rowIndex === rowIndex;

      const offsetLeft = computeOffsetLeft(
        columnPositions,
        currentRenderContext,
        pinnedColumns.left.length,
        layoutMode,
      );
      const showBottomBorder = isLastVisibleInSection && rowParams.position === 'top';

      const firstColumnIndex = currentRenderContext.firstColumnIndex;
      const lastColumnIndex = currentRenderContext.lastColumnIndex;

      rowElements.push(
        renderRow({
          id,
          model,
          rowIndex,
          offsetLeft,
          columnsTotalWidth,
          baseRowHeight,
          firstColumnIndex,
          lastColumnIndex,
          focusedColumnIndex: isVirtualFocusColumn ? focusedVirtualCell!.columnIndex : undefined,
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
      if (
        rowParams.position === undefined &&
        isLastVisibleInSection &&
        renderInfiniteLoadingTrigger
      ) {
        rowElements.push(renderInfiniteLoadingTrigger(id));
      }
    });
    return rowElements;
  };

  const scrollRestoreCallback = React.useRef<Function | null>(null);

  useEnhancedEffect(() => {
    if (!isRenderContextReady.current) {
      return;
    }
    forceUpdateRenderContextCallback();
  }, [enabledForColumns, enabledForRows, forceUpdateRenderContextCallback]);

  useEnhancedEffect(() => {
    if (layout.refs.scroller.current) {
      layout.refs.scroller.current.scrollLeft = 0;
    }
  }, [layout.refs.scroller, scrollReset]);

  useRunOnce(renderContext !== EMPTY_RENDER_CONTEXT, () => {
    onScrollChange?.(scrollPosition.current, renderContext);

    isRenderContextReady.current = true;

    if (initialState?.scroll && layout.refs.scroller.current) {
      const scroller = layout.refs.scroller.current;
      const { top, left } = initialState.scroll;

      const isScrollRestored = {
        top: !(top > 0),
        left: !(left > 0),
      };

      if (!isScrollRestored.left && columnsTotalWidth) {
        scroller.scrollLeft = left;
        isScrollRestored.left = true;
        ignoreNextScrollEvent.current = true;
      }

      // To restore the vertical scroll, we need to wait until the rows are available in the DOM (otherwise
      // there's nowhere to scroll). We still set the scrollTop to the initial value at this point in case
      // there already are rows rendered in the DOM, but we only confirm `isScrollRestored.top = true` in the
      // asynchronous callback below.
      if (!isScrollRestored.top && contentHeight) {
        scroller.scrollTop = top;
        ignoreNextScrollEvent.current = true;
      }

      if (!isScrollRestored.top || !isScrollRestored.left) {
        scrollRestoreCallback.current = (
          columnsTotalWidthCurrent: number,
          contentHeightCurrent: number,
        ) => {
          if (!isScrollRestored.left && columnsTotalWidthCurrent) {
            scroller.scrollLeft = left;
            isScrollRestored.left = true;
            ignoreNextScrollEvent.current = true;
          }
          if (!isScrollRestored.top && contentHeightCurrent) {
            scroller.scrollTop = top;
            isScrollRestored.top = true;
            ignoreNextScrollEvent.current = true;
          }
          if (isScrollRestored.left && isScrollRestored.top) {
            scrollRestoreCallback.current = null;
          }
        };
      }
    }
  });

  useStoreEffect(store, Dimensions.selectors.dimensions, forceUpdateRenderContext);

  useEnhancedEffect(() => {
    if (layout.refs.scroller) {
      scrollRestoreCallback.current?.(columnsTotalWidth, contentHeight);
    }
  }, [layout.refs.scroller, columnsTotalWidth, contentHeight]);

  const isFirstSizing = React.useRef(true);

  const containerRef = useRefCallback((node: HTMLDivElement | null) => {
    layout.refs.container.current = node;
    const unsubscribe = observeRootNode(node, store, (rootSize: Size) => {
      if (
        rootSize.width === 0 &&
        rootSize.height === 0 &&
        store.state.rootSize.height !== 0 &&
        store.state.rootSize.width !== 0
      ) {
        return;
      }
      store.state.rootSize = rootSize;
      if (isFirstSizing.current || !api.debouncedUpdateDimensions) {
        // We want to initialize the grid dimensions as soon as possible to avoid flickering
        api.updateDimensions(isFirstSizing.current);
        isFirstSizing.current = false;
      } else {
        api.debouncedUpdateDimensions();
      }
    });
    return () => {
      unsubscribe?.();
      layout.refs.container.current = null;
    };
  });

  const scrollerRef = useRefCallback((node: HTMLDivElement) => {
    layout.refs.scroller.current = node;
    const opts: AddEventListenerOptions = { passive: true };
    node.addEventListener('scroll', handleScroll, opts);
    node.addEventListener('wheel', onWheel as any, opts);
    node.addEventListener('touchmove', onTouchMove as any, opts);
    return () => {
      node.removeEventListener('scroll', handleScroll, opts);
      node.removeEventListener('wheel', onWheel as any, opts);
      node.removeEventListener('touchmove', onTouchMove as any, opts);
      layout.refs.scroller.current = null;
    };
  });

  const layoutParams = {
    containerRef,
    scrollerRef,
  };

  const layoutAPI = layout.use(store, params, api, layoutParams);

  const getters = {
    setPanels,
    getRows,
    rows: params.rows,
    ...layoutAPI,
  };

  return {
    getters,
    setPanels,
    forceUpdateRenderContext,
    scheduleUpdateRenderContext,
    ...createSpanningAPI(),
  };
}

type RenderContextInputs = ReturnType<typeof inputsSelector>;

function inputsSelector(
  store: Store<BaseState>,
  params: ParamsWithDefaults,
  api: RequiredAPI,
  enabledForRows: boolean,
  enabledForColumns: boolean,
  layoutMode: VirtualizationState['layoutMode'],
) {
  const dimensions = Dimensions.selectors.dimensions(store.state);
  const rows = params.rows;
  const range = params.range;
  const columns = params.columns;

  const hiddenCellsOriginMap = api.getHiddenCellsOrigin();
  const lastRowId = params.rows.at(-1)?.id;
  const lastColumn = columns.at(-1);

  return {
    api,
    enabledForRows,
    enabledForColumns,
    autoHeight: dimensions.autoHeight,
    rowBufferPx: params.virtualization.rowBufferPx,
    columnBufferPx: params.virtualization.columnBufferPx,
    leftPinnedWidth: dimensions.leftPinnedWidth,
    rightPinnedWidth: dimensions.rightPinnedWidth,
    columnsTotalWidth: dimensions.columnsTotalWidth,
    viewportInnerWidth: dimensions.viewportInnerSize.width,
    viewportInnerHeight: dimensions.viewportInnerSize.height,
    lastRowHeight: lastRowId !== undefined ? api.rowsMeta.getRowHeight(lastRowId) : 0,
    lastColumnWidth: lastColumn?.computedWidth ?? 0,
    rowsMeta: Dimensions.selectors.rowsMeta(store.state),
    columnPositions: Dimensions.selectors.columnPositions(store.state, params.columns),
    rows,
    range,
    pinnedColumns: params.pinnedColumns,
    columns,
    hiddenCellsOriginMap,
    virtualizeColumnsWithAutoRowHeight: params.virtualizeColumnsWithAutoRowHeight,
    layoutMode,
  };
}

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

  // XXX
  // if (inputs.listView) {
  //   return {
  //     ...renderContext,
  //     lastColumnIndex: 1,
  //   };
  // }
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
      spillOverflow: inputs.layoutMode === 'sticky',
    });

    if (!inputs.virtualizeColumnsWithAutoRowHeight) {
      for (let i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
        const row = inputs.rows[i];
        hasRowWithAutoHeight = inputs.api.rowsMeta.rowHasAutoHeight(row.id);
      }
    }

    if (!hasRowWithAutoHeight || inputs.virtualizeColumnsWithAutoRowHeight) {
      firstColumnIndex = binarySearch(realLeft, inputs.columnPositions, {
        atStart: true,
        lastPosition: inputs.columnsTotalWidth,
      });
      // In controlled mode, the horizontal window is clipped to the viewport and
      // the pinned-right section overlays it, so it can be excluded from the bounds.
      const rightBound =
        inputs.layoutMode === 'controlled'
          ? realLeft + inputs.viewportInnerWidth - inputs.rightPinnedWidth
          : realLeft + inputs.viewportInnerWidth;
      lastColumnIndex = binarySearch(rightBound, inputs.columnPositions);
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
  const lastMeasuredIndexRelativeToAllRows = inputs.api.rowsMeta.getLastMeasuredRowIndex();
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
    spillOverflow: inputs.layoutMode === 'sticky',
  });

  const [initialFirstColumnToRender, lastColumnToRender] = getIndexesToRender({
    firstIndex: nextRenderContext.firstColumnIndex,
    lastIndex: nextRenderContext.lastColumnIndex,
    minFirstIndex: inputs.pinnedColumns?.left.length ?? 0,
    maxLastIndex: inputs.columns.length - (inputs.pinnedColumns?.right.length ?? 0),
    bufferBefore: scrollCache.buffer.columnBefore,
    bufferAfter: scrollCache.buffer.columnAfter,
    positions: inputs.columnPositions,
    lastSize: inputs.lastColumnWidth,
    spillOverflow: inputs.layoutMode === 'sticky',
  });

  const firstColumnToRender = getFirstNonSpannedColumnToRender({
    api: inputs.api,
    firstColumnToRender: initialFirstColumnToRender,
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
  spillOverflow,
}: {
  firstIndex: number;
  lastIndex: number;
  bufferBefore: number;
  bufferAfter: number;
  minFirstIndex: number;
  maxLastIndex: number;
  positions: number[];
  lastSize: number;
  spillOverflow?: boolean;
}) {
  let firstPosition = positions[firstIndex] - bufferBefore;
  let lastPosition = positions[lastIndex] + bufferAfter;

  if (spillOverflow) {
    // Sticky mode keeps the rendered window size constant (see `bufferForDirection`).
    // Near the content edges part of a buffer has nothing left to extend into, which
    // would shrink the window and resize its layer. Spill that part to the other
    // side instead, so e.g. a fling that starts at the very top (where the backward
    // buffer is void) doesn't grow the window when the buffers turn direction.
    const startBound = positions[minFirstIndex] ?? 0;
    const endBound = positions[maxLastIndex] ?? (positions[positions.length - 1] ?? 0) + lastSize;
    const startOverflow = startBound - firstPosition;
    const endOverflow = lastPosition - endBound;
    if (startOverflow > 0) {
      firstPosition = startBound;
      lastPosition += startOverflow;
    }
    if (endOverflow > 0) {
      lastPosition = endBound;
      firstPosition -= endOverflow;
    }
  }

  const firstIndexPadded = binarySearch(firstPosition, positions, {
    atStart: true,
    lastPosition: positions[positions.length - 1] + lastSize,
  });

  const lastIndexPadded = binarySearch(lastPosition, positions) + 1;

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
  layoutMode: VirtualizationState['layoutMode'] = 'uncontrolled',
) {
  let offset = columnPositions[renderContext.firstColumnIndex] ?? 0;
  /* In uncontrolled & sticky modes, pinned cells are sticky elements in the normal
   * flow of the row, so their width is deduced from the offset. */
  if (layoutMode !== 'controlled') {
    offset -= columnPositions[pinnedLeftLength] ?? 0;
  }
  return Math.abs(offset);
}

/**
 * Anchor to apply along with `renderContext`. Only the sticky layout renders the rows
 * in an anchored box; the other layouts leave the anchor untouched.
 */
function anchorTopFor(
  store: Store<BaseState>,
  layoutMode: VirtualizationState<string>['layoutMode'],
  renderContext: RenderContext,
  isSettled: boolean,
) {
  const { anchorTop } = store.state.virtualization;
  if (layoutMode !== 'sticky') {
    return anchorTop;
  }
  const rowPositions = Dimensions.selectors.rowPositions(store.state);
  return nextAnchorTop(anchorTop, rowPositions[renderContext.firstRowIndex] ?? 0, isSettled);
}

/**
 * Mean height of the rows that are actually laid out, falling back to the `rowHeight`
 * dimension until the first measurement lands.
 *
 * Buffers and the update threshold are expressed in rows, but `rowHeight` is only the
 * default height: `getRowHeight` may return anything, and the two are then off by the
 * ratio between them. Sizing from the declared height would give the compositor
 * proportionally less runway than intended whenever rows are taller than the default,
 * and rasterize a proportionally larger window than intended whenever they are shorter.
 */
function averageRowHeight(store: Store<BaseState>, rowHeight: number) {
  const rowsMeta = Dimensions.selectors.rowsMeta(store.state);
  const rowCount = rowsMeta.positions.length;
  if (rowCount === 0) {
    return rowHeight;
  }
  const average = rowsMeta.currentPageTotalHeight / rowCount;
  return average > 0 ? average : rowHeight;
}

const EMPTY_BUFFER = {
  rowAfter: 0,
  rowBefore: 0,
  columnAfter: 0,
  columnBefore: 0,
};

function bufferForDirection(
  isRtl: boolean,
  direction: ScrollDirection,
  rowBufferPx: number,
  columnBufferPx: number,
  verticalBuffer: number,
  horizontalBuffer: number,
  layoutMode: VirtualizationState['layoutMode'] = 'uncontrolled',
) {
  if (layoutMode === 'controlled') {
    return EMPTY_BUFFER;
  }

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

  if (layoutMode === 'sticky') {
    // In sticky mode, the window is rasterized as a single layer, and resizing it
    // discards that raster wholesale at scroll start, exactly when the compositor
    // needs it. Keep the per-axis buffer total constant across direction changes
    // (symmetric at rest, fully moved to the leading edge while scrolling), so a
    // direction change only moves the window, never resizes it. The cross axis keeps
    // its resting allocation for the same reason.
    const rowBuffer = Math.max(2 * rowBufferPx, verticalBuffer);
    const columnBuffer = Math.max(2 * columnBufferPx, horizontalBuffer);
    switch (direction) {
      case ScrollDirection.NONE:
        return {
          rowAfter: rowBuffer / 2,
          rowBefore: rowBuffer / 2,
          columnAfter: columnBuffer / 2,
          columnBefore: columnBuffer / 2,
        };
      case ScrollDirection.LEFT:
        return {
          rowAfter: rowBuffer / 2,
          rowBefore: rowBuffer / 2,
          columnAfter: 0,
          columnBefore: columnBuffer,
        };
      case ScrollDirection.RIGHT:
        return {
          rowAfter: rowBuffer / 2,
          rowBefore: rowBuffer / 2,
          columnAfter: columnBuffer,
          columnBefore: 0,
        };
      case ScrollDirection.UP:
        return {
          rowAfter: 0,
          rowBefore: rowBuffer,
          columnAfter: columnBuffer / 2,
          columnBefore: columnBuffer / 2,
        };
      case ScrollDirection.DOWN:
        return {
          rowAfter: rowBuffer,
          rowBefore: 0,
          columnAfter: columnBuffer / 2,
          columnBefore: columnBuffer / 2,
        };
      default:
        throw /* minify-error-disabled */ new Error('unreachable');
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
      throw /* minify-error-disabled */ new Error('unreachable');
  }
}

/**
 * Whether the viewport has consumed more than half of the rendered buffer on a side
 * that can still be extended.
 * Triggers the sticky-mode rendering logic for computing a new render context.
 * Consecutive updates are thereby spaced half a buffer apart instead of one
 * row apart, leaving the raster pipeline idle time to fill the buffers between them.
 * The visible bounds mirror the ones `computeRenderContext` searches with.
 */
function isLowOnRenderedBuffer(
  store: Store<BaseState>,
  params: ParamsWithDefaults,
  scrollPosition: ScrollPosition,
  scrollCache: ScrollCache,
) {
  const context = store.state.virtualization.renderContext;
  const { buffer } = scrollCache;
  const dimensions = Dimensions.selectors.dimensions(store.state);
  const rowPositions = Dimensions.selectors.rowPositions(store.state);
  const contentHeight = Dimensions.selectors.contentHeight(store.state);

  const visibleTop = scrollPosition.top;
  const visibleBottom = visibleTop + dimensions.viewportInnerSize.height;
  const renderedTop = rowPositions[context.firstRowIndex] ?? 0;
  const renderedBottom = rowPositions[context.lastRowIndex] ?? contentHeight;

  if (context.firstRowIndex > 0 && visibleTop - renderedTop < buffer.rowBefore / 2) {
    return true;
  }
  if (
    context.lastRowIndex < params.rows.length &&
    renderedBottom - visibleBottom < buffer.rowAfter / 2
  ) {
    return true;
  }

  const columnPositions = Dimensions.selectors.columnPositions(store.state, params.columns);
  const pinnedLeftCount = params.pinnedColumns?.left.length ?? 0;
  const pinnedRightCount = params.pinnedColumns?.right.length ?? 0;

  const visibleLeft = Math.abs(scrollPosition.left) + dimensions.leftPinnedWidth;
  const visibleRight = visibleLeft + dimensions.viewportInnerSize.width;
  const renderedLeft = columnPositions[context.firstColumnIndex] ?? 0;
  const renderedRight = columnPositions[context.lastColumnIndex] ?? dimensions.columnsTotalWidth;

  if (
    context.firstColumnIndex > pinnedLeftCount &&
    visibleLeft - renderedLeft < buffer.columnBefore / 2
  ) {
    return true;
  }
  if (
    context.lastColumnIndex < params.columns.length - pinnedRightCount &&
    renderedRight - visibleRight < buffer.columnAfter / 2
  ) {
    return true;
  }

  return false;
}

function createScrollCache(
  isRtl: boolean,
  rowBufferPx: number,
  columnBufferPx: number,
  verticalBuffer: number,
  horizontalBuffer: number,
  layoutMode: VirtualizationState['layoutMode'] = 'uncontrolled',
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
      layoutMode,
    ),
  };
}
type ScrollCache = ReturnType<typeof createScrollCache>;

function createRange(from: number, to: number) {
  return Array.from({ length: to - from }).map((_, i) => from + i);
}

function getFirstNonSpannedColumnToRender({
  api,
  firstColumnToRender,
  firstRowToRender,
  lastRowToRender,
  visibleRows,
}: {
  api: RequiredAPI;
  firstColumnToRender: number;
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
        const cellColSpanInfo = api.getCellColSpanInfo(rowId, firstNonSpannedColumnToRender);

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

/** Placeholder API functions for colspan & rowspan to re-implement */
function createSpanningAPI(): AbstractAPI {
  const getCellColSpanInfo: AbstractAPI['getCellColSpanInfo'] = () => {
    throw new Error('MUI X: Unimplemented: colspan feature is required');
  };

  const calculateColSpan: AbstractAPI['calculateColSpan'] = () => {
    throw new Error('MUI X: Unimplemented: colspan feature is required');
  };

  const getHiddenCellsOrigin: AbstractAPI['getHiddenCellsOrigin'] = () => {
    throw new Error('MUI X: Unimplemented: rowspan feature is required');
  };

  return { getCellColSpanInfo, calculateColSpan, getHiddenCellsOrigin };
}

export function roundToDecimalPlaces(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
