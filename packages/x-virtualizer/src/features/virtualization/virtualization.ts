'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLazyRef from '@mui/utils/useLazyRef';
import useTimeout from '@mui/utils/useTimeout';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { integer } from '@mui/x-internals/types';
import * as platform from '@mui/x-internals/platform';
import { useRunOnce } from '@mui/x-internals/useRunOnce';
import { createSelector, useStore, useStoreEffect, Store } from '@mui/x-internals/store';
import reactMajor from '@mui/x-internals/reactMajor';
import { PinnedRows, PinnedColumns, Size } from '../../models/core';
import type { CellColSpanInfo } from '../../models/colspan';
import { Dimensions, observeRootNode } from '../dimensions';
import type { BaseState, ParamsWithDefaults } from '../../useVirtualizer';
import type { Layout } from './layout';
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

export type VirtualizationParams = {
  /** @default false */
  isRtl?: boolean;
  /** The row buffer in pixels to render before and after the viewport.
   * @default 150 */
  rowBufferPx?: number;
  /** The column buffer in pixels to render before and after the viewport.
   * @default 150 */
  columnBufferPx?: number;
};

export type VirtualizationState<K extends string = string> = {
  enabled: boolean;
  enabledForRows: boolean;
  enabledForColumns: boolean;
  renderContext: RenderContext;
  props: Record<K, Record<string, any>>;
  context: Record<string, any>;
  scrollPosition: { current: ScrollPosition };
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
  return {
    store: createSelector((state: BaseState) => state.virtualization),
    renderContext: createSelector((state: BaseState) => state.virtualization.renderContext),
    enabledForRows: createSelector((state: BaseState) => state.virtualization.enabledForRows),
    enabledForColumns: createSelector((state: BaseState) => state.virtualization.enabledForColumns),
    offsetTop: createSelector(
      Dimensions.selectors.rowPositions,
      firstRowIndexSelector,
      (rowPositions, firstRowIndex) => rowPositions[firstRowIndex] ?? 0,
    ),
    context: createSelector((state: BaseState) => state.virtualization.context),
    scrollPosition: createSelector((state: BaseState) => state.virtualization.scrollPosition),
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
  const state: Virtualization.State<typeof params.layout> = {
    virtualization: {
      enabled: !platform.isJSDOM,
      enabledForRows: !platform.isJSDOM,
      enabledForColumns: !platform.isJSDOM,
      renderContext: EMPTY_RENDER_CONTEXT,
      props: (params.layout.constructor as typeof Layout).elements.reduce(
        (acc, key) => (acc[key as string], acc),
        {} as Record<string, Record<string, any>>,
      ),
      context: {},
      scrollPosition: { current: ScrollPosition.EMPTY },
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
  const scrollCache = useLazyRef(() =>
    createScrollCache(isRtl, rowBufferPx, columnBufferPx, rowHeight * 15, MINIMUM_COLUMN_WIDTH * 6),
  ).current;

  const updateRenderContext = React.useCallback(
    (nextRenderContext: RenderContext) => {
      if (!areRenderContextsEqual(nextRenderContext, store.state.virtualization.renderContext)) {
        store.set('virtualization', {
          ...store.state.virtualization,
          renderContext: nextRenderContext,
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

  const triggerUpdateRenderContext = useEventCallback(() => {
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

    const isScrolling = dx !== 0 || dy !== 0;

    scrollPosition.current = newScroll;

    const direction = isScrolling ? ScrollDirection.forDelta(dx, dy) : ScrollDirection.NONE;

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
      store.set('virtualization', {
        ...store.state.virtualization,
        scrollPosition: { current: { ...scrollPosition.current } },
      });
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

    const inputs = inputsSelector(store, params, api, enabledForRows, enabledForColumns);
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
    const inputs = inputsSelector(store, params, api, enabledForRows, enabledForColumns);
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
      if (focusedVirtualCell.rowIndex < firstRowToRender) {
        rowIndexes.unshift(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
      }
      if (focusedVirtualCell.rowIndex > lastRowToRender) {
        rowIndexes.push(focusedVirtualCell.rowIndex);
        virtualRowIndex = focusedVirtualCell.rowIndex;
      }
    }

    const rowElements: React.ReactNode[] = [];
    const columnPositions = Dimensions.selectors.columnPositions(store.state, columns);

    rowIndexes.forEach((rowIndexInPage) => {
      const rowModel = rowModels[rowIndexInPage];
      if (!rowModel) {
        return;
      }
      const { id, model } = rowModel;

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

function useRefCallback(fn: (node: HTMLDivElement) => (() => void) | undefined) {
  const refCleanup = React.useRef<() => void | undefined>(undefined);
  const refCallback = useEventCallback((node: HTMLDivElement | null) => {
    if (!node) {
      // Cleanup for R18
      refCleanup.current?.();
      return;
    }

    refCleanup.current = fn(node);

    if (reactMajor >= 19) {
      /* eslint-disable-next-line consistent-return */
      return refCleanup.current;
    }
  });
  return refCallback;
}

type RenderContextInputs = ReturnType<typeof inputsSelector>;

function inputsSelector(
  store: Store<BaseState>,
  params: ParamsWithDefaults,
  api: RequiredAPI,
  enabledForRows: boolean,
  enabledForColumns: boolean,
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
    throw new Error('Unimplemented: colspan feature is required');
  };

  const calculateColSpan: AbstractAPI['calculateColSpan'] = () => {
    throw new Error('Unimplemented: colspan feature is required');
  };

  const getHiddenCellsOrigin: AbstractAPI['getHiddenCellsOrigin'] = () => {
    throw new Error('Unimplemented: rowspan feature is required');
  };

  return { getCellColSpanInfo, calculateColSpan, getHiddenCellsOrigin };
}

export function roundToDecimalPlaces(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
