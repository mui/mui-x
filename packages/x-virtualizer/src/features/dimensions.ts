import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import useLayoutEffect from '@mui/utils/useEnhancedEffect';
import { throttle } from '@mui/x-internals/throttle';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { roundToDecimalPlaces } from '@mui/x-internals/math';
import { Store, useSelectorEffect } from '@mui/x-internals/store';
import { Size, DimensionsState, RowsMetaState } from '../models';
import type { VirtualizerParams } from '../useVirtualizer';
import type { BaseState } from '../useVirtualizer';

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
  headerHeight: 0,
  groupHeaderHeight: 0,
  headerFilterHeight: 0,
  rowWidth: 0,
  rowHeight: 0,
  columnsTotalWidth: 0,
  leftPinnedWidth: 0,
  rightPinnedWidth: 0,
  headersTotalHeight: 0,
  topContainerHeight: 0,
  bottomContainerHeight: 0,
};

const selectors = {
  rootSize: (state: BaseState) => state.rootSize,
  dimensions: (state: BaseState) => state.dimensions,
  rowsMeta: (state: BaseState) => state.rowsMeta,
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
}

function initializeState(params: VirtualizerParams): Dimensions.State {
  const dimensions = {
    ...EMPTY_DIMENSIONS,
    ...params.dimensions,
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

function useDimensions(store: Store<BaseState>, params: VirtualizerParams) {
  const isFirstSizing = React.useRef(true);

  const {
    refs,
    dimensions: {
      rowHeight,
      headerHeight,
      columnsTotalWidth,
      groupHeaderHeight,
      headerFilterHeight,
      headersTotalHeight,
      leftPinnedWidth,
      rightPinnedWidth,
    },
  } = params;

  const updateDimensions = React.useCallback(() => {
    if (isFirstSizing.current) {
      return;
    }

    const rootSize = selectors.rootSize(store.state);

    // All the floating point dimensions should be rounded to .1 decimal places to avoid subpixel rendering issues
    // https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
    // https://github.com/mui/mui-x/issues/15721
    const scrollbarSize = measureScrollbarSize(params.refs.container.current, params.scrollbarSize);

    const rowsMeta = params.fixme.rowsMeta();

    const topContainerHeight = headersTotalHeight + rowsMeta.pinnedTopRowsTotalHeight;
    const bottomContainerHeight = rowsMeta.pinnedBottomRowsTotalHeight;

    const contentSize = {
      width: columnsTotalWidth,
      height: roundToDecimalPlaces(rowsMeta.currentPageTotalHeight, 1),
    };

    let viewportOuterSize: Size;
    let viewportInnerSize: Size;
    let hasScrollX = false;
    let hasScrollY = false;

    if (params.autoHeight) {
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
        height: Math.max(0, viewportOuterSize.height - topContainerHeight - bottomContainerHeight),
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
      headerHeight,
      groupHeaderHeight,
      headerFilterHeight,
      rowWidth,
      rowHeight,
      columnsTotalWidth,
      leftPinnedWidth,
      rightPinnedWidth,
      headersTotalHeight,
      topContainerHeight,
      bottomContainerHeight,
    };

    const prevDimensions = store.state.dimensions;

    if (isDeepEqual(prevDimensions as any, newDimensions)) {
      return;
    }

    store.update({ dimensions: newDimensions });
  }, [
    params.scrollbarSize,
    params.autoHeight,
    rowHeight,
    headerHeight,
    groupHeaderHeight,
    headerFilterHeight,
    columnsTotalWidth,
    headersTotalHeight,
    leftPinnedWidth,
    rightPinnedWidth,
  ]);

  const updateDimensionCallback = useEventCallback(updateDimensions);
  const debouncedUpdateDimensions = React.useMemo(
    () =>
      params.resizeThrottleMs > 0
        ? throttle(() => {
            updateDimensionCallback();
            params.onResize?.(store.state.rootSize);
          }, params.resizeThrottleMs)
        : undefined,
    [params.resizeThrottleMs, params.onResize, store, updateDimensionCallback],
  );
  React.useEffect(() => debouncedUpdateDimensions?.clear, [debouncedUpdateDimensions]);

  useLayoutEffect(() => observeRootNode(refs.container.current, store), [refs, store]);

  useLayoutEffect(updateDimensions, [updateDimensions]);

  useSelectorEffect(store, selectors.rootSize, (_, size) => {
    params.onResize?.(size);

    if (isFirstSizing.current || !debouncedUpdateDimensions) {
      // We want to initialize the grid dimensions as soon as possible to avoid flickering
      isFirstSizing.current = false;
      updateDimensions();
    } else {
      debouncedUpdateDimensions();
    }
  });

  return {
    updateDimensions,
    debouncedUpdateDimensions,
  };
}

function observeRootNode(node: Element | null, store: Store<BaseState>) {
  if (!node) {
    return undefined;
  }
  const bounds = node.getBoundingClientRect();
  const initialSize = {
    width: roundToDecimalPlaces(bounds.width, 1),
    height: roundToDecimalPlaces(bounds.height, 1),
  };
  if (store.state.rootSize === Size.EMPTY || !Size.equals(initialSize, store.state.rootSize)) {
    store.update({ rootSize: initialSize });
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
      store.update({ rootSize });
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
