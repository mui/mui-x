'use client';
import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';
import useLazyRef from '@mui/utils/useLazyRef';
import useLayoutEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { throttle } from '@mui/x-internals/throttle';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { roundToDecimalPlaces } from '@mui/x-internals/math';
import { Store, useStore, createSelectorMemoized } from '@mui/x-internals/store';
import { ColumnWithWidth, DimensionsState, RowId, RowEntry, RowsMetaState, Size } from '../models';
import type { BaseState, ParamsWithDefaults } from '../useVirtualizer';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */
/* eslint-disable no-underscore-dangle */

export type DimensionsParams = {
  rowHeight: number;
  columnsTotalWidth?: number;
  leftPinnedWidth?: number;
  rightPinnedWidth?: number;
  topPinnedHeight?: number;
  bottomPinnedHeight?: number;
  autoHeight?: boolean;
  minimalContentHeight?: number | string;
  scrollbarSize?: number;
};

const EMPTY_DIMENSIONS: DimensionsState = {
  isReady: false,
  root: Size.EMPTY,
  viewportOuterSize: Size.EMPTY,
  viewportInnerSize: Size.EMPTY,
  contentSize: Size.EMPTY,
  minimumSize: Size.EMPTY,
  hasScrollX: false,
  hasScrollY: false,
  scrollbarSize: 0,
  rowWidth: 0,
  rowHeight: 0,
  columnsTotalWidth: 0,
  leftPinnedWidth: 0,
  rightPinnedWidth: 0,
  topContainerHeight: 0,
  bottomContainerHeight: 0,
  autoHeight: false,
  minimalContentHeight: undefined,
};

const selectors = {
  rootSize: (state: BaseState) => state.rootSize,
  dimensions: (state: BaseState) => state.dimensions,
  rowHeight: (state: BaseState) => state.dimensions.rowHeight,
  columnsTotalWidth: (state: BaseState) => state.dimensions.columnsTotalWidth,
  contentHeight: (state: BaseState) => state.dimensions.contentSize.height,
  autoHeight: (state: BaseState) => state.dimensions.autoHeight,
  minimalContentHeight: (state: BaseState) => state.dimensions.minimalContentHeight,
  rowsMeta: (state: BaseState) => state.rowsMeta,
  rowPositions: (state: BaseState) => state.rowsMeta.positions,
  columnPositions: createSelectorMemoized((_, columns: ColumnWithWidth[]) => {
    const positions: number[] = [];
    let currentPosition = 0;

    for (let i = 0; i < columns.length; i += 1) {
      positions.push(currentPosition);
      currentPosition += columns[i].computedWidth;
    }

    return positions;
  }),
  needsHorizontalScrollbar: (state: BaseState) =>
    state.dimensions.viewportOuterSize.width > 0 &&
    state.dimensions.columnsTotalWidth > state.dimensions.viewportOuterSize.width,
};

export const Dimensions = {
  initialize: initializeState,
  use: useDimensions,
  selectors,
};
export namespace Dimensions {
  export type State = {
    rootSize: Size;
    dimensions: DimensionsState;
    rowsMeta: RowsMetaState;
    rowHeights: Map<any, any>; // FIXME: typing
  };
  export type API = ReturnType<typeof useDimensions>;
}

function initializeState(params: ParamsWithDefaults): Dimensions.State {
  const dimensions = {
    ...EMPTY_DIMENSIONS,
    ...params.dimensions,
    autoHeight: params.dimensions.autoHeight,
    minimalContentHeight: params.dimensions.minimalContentHeight,
  };

  const { rowCount } = params;
  const { rowHeight } = dimensions;

  const rowsMeta = {
    currentPageTotalHeight: rowCount * rowHeight,
    positions: Array.from({ length: rowCount }, (_, i) => i * rowHeight),
    pinnedTopRowsTotalHeight: 0,
    pinnedBottomRowsTotalHeight: 0,
  };

  const rowHeights = new Map();

  return {
    rootSize: Size.EMPTY,
    dimensions,
    rowsMeta,
    rowHeights,
  };
}

function useDimensions(store: Store<BaseState>, params: ParamsWithDefaults, _api: {}) {
  const isFirstSizing = React.useRef(true);

  const {
    layout,
    dimensions: {
      rowHeight,
      columnsTotalWidth,
      leftPinnedWidth,
      rightPinnedWidth,
      topPinnedHeight,
      bottomPinnedHeight,
    },
    onResize,
  } = params;

  const updateDimensions = React.useCallback(
    (firstUpdate?: boolean) => {
      if (firstUpdate) {
        isFirstSizing.current = false;
      }
      if (isFirstSizing.current) {
        return;
      }

      const containerNode = layout.refs.container.current;
      const rootSize = selectors.rootSize(store.state);
      const rowsMeta = selectors.rowsMeta(store.state);

      // All the floating point dimensions should be rounded to .1 decimal places to avoid subpixel rendering issues
      // https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
      // https://github.com/mui/mui-x/issues/15721
      const scrollbarSize = measureScrollbarSize(containerNode, params.dimensions.scrollbarSize);

      const topContainerHeight = topPinnedHeight + rowsMeta.pinnedTopRowsTotalHeight;
      const bottomContainerHeight = bottomPinnedHeight + rowsMeta.pinnedBottomRowsTotalHeight;

      const contentSize = {
        width: columnsTotalWidth,
        height: roundToDecimalPlaces(rowsMeta.currentPageTotalHeight, 1),
      };

      let viewportOuterSize: Size;
      let viewportInnerSize: Size;
      let hasScrollX = false;
      let hasScrollY = false;

      if (params.dimensions.autoHeight) {
        hasScrollY = false;
        hasScrollX = Math.round(columnsTotalWidth) > Math.round(rootSize.width);

        viewportOuterSize = {
          width: rootSize.width,
          height: topContainerHeight + bottomContainerHeight + contentSize.height,
        };
        viewportInnerSize = {
          width: Math.max(0, viewportOuterSize.width - (hasScrollY ? scrollbarSize : 0)),
          height: Math.max(0, viewportOuterSize.height - (hasScrollX ? scrollbarSize : 0)),
        };
      } else {
        viewportOuterSize = {
          width: rootSize.width,
          height: rootSize.height,
        };
        viewportInnerSize = {
          width: Math.max(0, viewportOuterSize.width),
          height: Math.max(
            0,
            viewportOuterSize.height - topContainerHeight - bottomContainerHeight,
          ),
        };

        const content = contentSize;
        const container = viewportInnerSize;

        const hasScrollXIfNoYScrollBar = content.width > container.width;
        const hasScrollYIfNoXScrollBar = content.height > container.height;

        if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
          hasScrollY = hasScrollYIfNoXScrollBar;
          hasScrollX = content.width + (hasScrollY ? scrollbarSize : 0) > container.width;

          // We recalculate the scroll y to consider the size of the x scrollbar.
          if (hasScrollX) {
            hasScrollY = content.height + scrollbarSize > container.height;
          }
        }

        if (hasScrollY) {
          viewportInnerSize.width -= scrollbarSize;
        }
        if (hasScrollX) {
          viewportInnerSize.height -= scrollbarSize;
        }
      }

      if (params.disableHorizontalScroll) {
        hasScrollX = false;
      }

      if (params.disableVerticalScroll) {
        hasScrollY = false;
      }

      const rowWidth = Math.max(
        viewportOuterSize.width,
        columnsTotalWidth + (hasScrollY ? scrollbarSize : 0),
      );

      const minimumSize = {
        width: columnsTotalWidth,
        height: topContainerHeight + contentSize.height + bottomContainerHeight,
      };

      const newDimensions: DimensionsState = {
        isReady: true,
        root: rootSize,
        viewportOuterSize,
        viewportInnerSize,
        contentSize,
        minimumSize,
        hasScrollX,
        hasScrollY,
        scrollbarSize,
        rowWidth,
        rowHeight,
        columnsTotalWidth,
        leftPinnedWidth,
        rightPinnedWidth,
        topContainerHeight,
        bottomContainerHeight,
        autoHeight: params.dimensions.autoHeight,
        minimalContentHeight: params.dimensions.minimalContentHeight,
      };

      const prevDimensions = store.state.dimensions;

      if (isDeepEqual(prevDimensions as any, newDimensions)) {
        return;
      }

      store.update({ dimensions: newDimensions });
      onResize?.(newDimensions.root);
    },
    [
      store,
      layout.refs.container,
      params.dimensions.scrollbarSize,
      params.dimensions.autoHeight,
      params.dimensions.minimalContentHeight,
      params.disableHorizontalScroll,
      params.disableVerticalScroll,
      onResize,
      rowHeight,
      columnsTotalWidth,
      leftPinnedWidth,
      rightPinnedWidth,
      topPinnedHeight,
      bottomPinnedHeight,
    ],
  );

  const { resizeThrottleMs } = params;
  const updateDimensionCallback = useEventCallback(updateDimensions);
  const debouncedUpdateDimensions = React.useMemo(
    () => (resizeThrottleMs > 0 ? throttle(updateDimensionCallback, resizeThrottleMs) : undefined),
    [resizeThrottleMs, updateDimensionCallback],
  );
  React.useEffect(() => debouncedUpdateDimensions?.clear, [debouncedUpdateDimensions]);

  useLayoutEffect(updateDimensions, [updateDimensions]);

  useLayoutEffect(() => {
    store.update({
      dimensions: {
        ...store.state.dimensions,
        autoHeight: params.dimensions.autoHeight,
        minimalContentHeight: params.dimensions.minimalContentHeight,
      },
    });
  }, [store, params.dimensions.autoHeight, params.dimensions.minimalContentHeight]);

  const rowsMeta = useRowsMeta(store, params, updateDimensions);

  return {
    updateDimensions,
    debouncedUpdateDimensions,
    rowsMeta,
  };
}

function useRowsMeta(
  store: Store<BaseState>,
  params: ParamsWithDefaults,
  updateDimensions: Function,
) {
  const heightCache = store.state.rowHeights;

  const { rows, getRowHeight: getRowHeightProp, getRowSpacing, getEstimatedRowHeight } = params;

  const lastMeasuredRowIndex = React.useRef(-1);
  const hasRowWithAutoHeight = React.useRef(false);
  const isHeightMetaValid = React.useRef(false);

  const pinnedRows = params.pinnedRows;
  const rowHeight = useStore(store, selectors.rowHeight);

  const getRowHeightEntry = useEventCallback((rowId: RowId) => {
    let entry = heightCache.get(rowId);
    if (entry === undefined) {
      entry = {
        content: store.state.dimensions.rowHeight,
        spacingTop: 0,
        spacingBottom: 0,
        detail: 0,
        autoHeight: false,
        needsFirstMeasurement: true,
      };
      heightCache.set(rowId, entry);
    }
    return entry;
  });

  const { applyRowHeight } = params;
  const processHeightEntry = React.useCallback(
    (row: RowEntry) => {
      // HACK: rowHeight trails behind the most up-to-date value just enough to
      // mess the initial rowsMeta hydration :/
      eslintUseValue(rowHeight);
      const dimensions = selectors.dimensions(store.state);
      const baseRowHeight = dimensions.rowHeight;

      const entry = getRowHeightEntry(row.id);

      if (!getRowHeightProp) {
        entry.content = baseRowHeight;
        entry.needsFirstMeasurement = false;
      } else {
        const rowHeightFromUser = getRowHeightProp(row);

        if (rowHeightFromUser === 'auto') {
          if (entry.needsFirstMeasurement) {
            const estimatedRowHeight = getEstimatedRowHeight
              ? getEstimatedRowHeight(row)
              : baseRowHeight;

            // If the row was not measured yet use the estimated row height
            entry.content = estimatedRowHeight ?? baseRowHeight;
          }

          hasRowWithAutoHeight.current = true;
          entry.autoHeight = true;
        } else {
          // Default back to base rowHeight if getRowHeight returns null value.
          entry.content = rowHeightFromUser ?? dimensions.rowHeight;
          entry.needsFirstMeasurement = false;
          entry.autoHeight = false;
        }
      }

      if (getRowSpacing) {
        const spacing = getRowSpacing(row);
        entry.spacingTop = spacing.top ?? 0;
        entry.spacingBottom = spacing.bottom ?? 0;
      } else {
        entry.spacingTop = 0;
        entry.spacingBottom = 0;
      }

      applyRowHeight?.(entry, row);

      return entry;
    },
    [
      store,
      getRowHeightProp,
      getRowHeightEntry,
      getEstimatedRowHeight,
      rowHeight,
      getRowSpacing,
      applyRowHeight,
    ],
  );

  const hydrateRowsMeta = React.useCallback(() => {
    hasRowWithAutoHeight.current = false;

    const pinnedTopRowsTotalHeight =
      pinnedRows?.top.reduce((acc, row) => {
        const entry = processHeightEntry(row);
        return acc + entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;
      }, 0) ?? 0;

    const pinnedBottomRowsTotalHeight =
      pinnedRows?.bottom.reduce((acc, row) => {
        const entry = processHeightEntry(row);
        return acc + entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;
      }, 0) ?? 0;

    const positions: number[] = [];
    const currentPageTotalHeight = rows.reduce((acc, row) => {
      positions.push(acc);

      const entry = processHeightEntry(row);
      const total = entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;

      return acc + total;
    }, 0);

    if (!hasRowWithAutoHeight.current) {
      // No row has height=auto, so all rows are already measured
      lastMeasuredRowIndex.current = Infinity;
    }

    const didHeightsChange =
      pinnedTopRowsTotalHeight !== store.state.rowsMeta.pinnedTopRowsTotalHeight ||
      pinnedBottomRowsTotalHeight !== store.state.rowsMeta.pinnedBottomRowsTotalHeight ||
      currentPageTotalHeight !== store.state.rowsMeta.currentPageTotalHeight;

    const rowsMeta = {
      currentPageTotalHeight,
      positions,
      pinnedTopRowsTotalHeight,
      pinnedBottomRowsTotalHeight,
    };

    store.set('rowsMeta', rowsMeta);
    if (didHeightsChange) {
      updateDimensions();
    }

    isHeightMetaValid.current = true;
  }, [store, pinnedRows, rows, processHeightEntry, updateDimensions]);
  const hydrateRowsMetaLatest = useEventCallback(hydrateRowsMeta);

  const getRowHeight = (rowId: RowId) => {
    return heightCache.get(rowId)?.content ?? selectors.rowHeight(store.state);
  };

  const storeRowHeightMeasurement = (id: RowId, height: number) => {
    const entry = getRowHeightEntry(id);

    const didChange = entry.content !== height;

    entry.needsFirstMeasurement = false;
    entry.content = height;

    isHeightMetaValid.current &&= !didChange;
  };

  const rowHasAutoHeight = (id: RowId) => {
    return heightCache.get(id)?.autoHeight ?? false;
  };

  const getLastMeasuredRowIndex = () => {
    return lastMeasuredRowIndex.current;
  };

  const setLastMeasuredRowIndex = (index: number) => {
    if (hasRowWithAutoHeight.current && index > lastMeasuredRowIndex.current) {
      lastMeasuredRowIndex.current = index;
    }
  };

  const resetRowHeights = () => {
    heightCache.clear();
    hydrateRowsMeta();
  };

  const resizeObserver = useLazyRef(() =>
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver((entries) => {
          for (let i = 0; i < entries.length; i += 1) {
            const entry = entries[i];
            const height =
              entry.borderBoxSize && entry.borderBoxSize.length > 0
                ? entry.borderBoxSize[0].blockSize
                : entry.contentRect.height;
            const rowId = (entry.target as any).__mui_id;
            const focusedVirtualRowId = params.focusedVirtualCell?.()?.id;
            if (focusedVirtualRowId === rowId && height === 0) {
              // Focused virtual row has 0 height.
              // We don't want to store it to avoid scroll jumping.
              // https://github.com/mui/mui-x/issues/14726
              return;
            }
            storeRowHeightMeasurement(rowId, height);
          }
          if (!isHeightMetaValid.current) {
            // Avoids "ResizeObserver loop completed with undelivered notifications" error
            requestAnimationFrame(() => {
              hydrateRowsMetaLatest();
            });
          }
        }),
  ).current;

  const observeRowHeight = (element: Element, rowId: RowId) => {
    (element as any).__mui_id = rowId;

    resizeObserver?.observe(element);

    return () => resizeObserver?.unobserve(element);
  };

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  useLayoutEffect(() => {
    hydrateRowsMeta();
  }, [hydrateRowsMeta]);

  return {
    getRowHeight,
    setLastMeasuredRowIndex,
    storeRowHeightMeasurement,
    hydrateRowsMeta,
    observeRowHeight,
    rowHasAutoHeight,
    getRowHeightEntry,
    getLastMeasuredRowIndex,
    resetRowHeights,
  };
}

export function observeRootNode(
  node: Element | null,
  store: Store<BaseState>,
  setRootSize: (size: Size) => void,
) {
  if (!node) {
    return undefined;
  }
  const bounds = node.getBoundingClientRect();
  const initialSize = {
    width: roundToDecimalPlaces(bounds.width, 1),
    height: roundToDecimalPlaces(bounds.height, 1),
  };
  if (store.state.rootSize === Size.EMPTY || !Size.equals(initialSize, store.state.rootSize)) {
    setRootSize(initialSize);
  }

  if (typeof ResizeObserver === 'undefined') {
    return undefined;
  }
  const observer = new ResizeObserver(([entry]) => {
    if (!entry) {
      return;
    }
    const rootSize = {
      width: roundToDecimalPlaces(entry.contentRect.width, 1),
      height: roundToDecimalPlaces(entry.contentRect.height, 1),
    };
    if (!Size.equals(rootSize, store.state.rootSize)) {
      setRootSize(rootSize);
    }
  });

  observer.observe(node);

  return () => {
    observer.disconnect();
  };
}

const scrollbarSizeCache = new WeakMap<Element, number>();
function measureScrollbarSize(element: Element | null, scrollbarSize: number | undefined) {
  if (scrollbarSize !== undefined) {
    return scrollbarSize;
  }

  if (element === null) {
    return 0;
  }

  const cachedSize = scrollbarSizeCache.get(element);
  if (cachedSize !== undefined) {
    return cachedSize;
  }

  const doc = ownerDocument(element);
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.className = 'scrollDiv';
  element.appendChild(scrollDiv);
  const size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  element.removeChild(scrollDiv);

  scrollbarSizeCache.set(element, size);

  return size;
}

function eslintUseValue(_: any) {}
