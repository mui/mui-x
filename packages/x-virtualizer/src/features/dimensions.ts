import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';
import useEventCallback from '@mui/utils/useEventCallback';
import platform from '@mui/x-internals/platform';
import { throttle } from '@mui/x-internals/throttle';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { roundToDecimalPlaces } from '@mui/x-internals/math';
import { Store, useSelectorEffect } from '@mui/x-internals/store';
import { Size, DimensionsState } from '../models';
import type { VirtualizerParams } from '../useVirtualizer';
import type { CoreState } from '../useVirtualizer';
import { Virtualization } from './virtualization';

const EMPTY_SIZE: Size = { width: 0, height: 0 };
const EMPTY_DIMENSIONS: DimensionsState = {
  isReady: false,
  root: EMPTY_SIZE,
  viewportOuterSize: EMPTY_SIZE,
  viewportInnerSize: EMPTY_SIZE,
  contentSize: EMPTY_SIZE,
  minimumSize: EMPTY_SIZE,
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
  dimensions: (state: CoreState) => state.dimensions,
};

export const Dimensions = {
  initialize: initializeState,
  use: useDimensions,
  selectors,
};
export namespace Dimensions {
  export type State = {
    dimensions: DimensionsState;
  };
}

function initializeState(params: VirtualizerParams) {
  const dimensions = EMPTY_DIMENSIONS;

  return {
    dimensions: {
      ...dimensions,
      ...params.dimensions,
    },
  };
}

function useDimensions(store: Store<CoreState>, params: VirtualizerParams) {
  const errorShown = React.useRef(false);
  const isFirstSizing = React.useRef(true);
  const rootDimensionsRef = React.useRef(EMPTY_SIZE);

  const {
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

  // updateDimensions
  // updateDimensions debounced

  const updateDimensions = React.useCallback(() => {
    if (isFirstSizing.current) {
      return;
    }
    // All the floating point dimensions should be rounded to .1 decimal places to avoid subpixel rendering issues
    // https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
    // https://github.com/mui/mui-x/issues/15721
    const scrollbarSize = measureScrollbarSize(params.refs.main.current, params.scrollbarSize);

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
      hasScrollX = Math.round(columnsTotalWidth) > Math.round(rootDimensionsRef.current.width);

      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: topContainerHeight + bottomContainerHeight + contentSize.height,
      };
      viewportInnerSize = {
        width: Math.max(0, viewportOuterSize.width - (hasScrollY ? scrollbarSize : 0)),
        height: Math.max(0, viewportOuterSize.height - (hasScrollX ? scrollbarSize : 0)),
      };
    } else {
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rootDimensionsRef.current.height,
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
      root: rootDimensionsRef.current,
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
    // setDimensions,
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
            params.onResize?.(rootDimensionsRef.current);
          }, params.resizeThrottleMs)
        : undefined,
    [params.resizeThrottleMs, params.onResize, updateDimensionCallback],
  );
  React.useEffect(() => debouncedUpdateDimensions?.clear, [debouncedUpdateDimensions]);

  // useSelectorEffect(store, Virtualization.selectors.rootSize, (_, size) => {
  //   if (size.height === 0 && !errorShown.current && !params.autoHeight && !platform.isJSDOM) {
  //     console.error(
  //       [
  //         'The parent DOM element of the Data Grid has an empty height.',
  //         'Please make sure that this element has an intrinsic height.',
  //         'The grid displays with a height of 0px.',
  //         '',
  //         'More details: https://mui.com/r/x-data-grid-no-dimensions.',
  //       ].join('\n'),
  //     );
  //     errorShown.current = true;
  //   }
  //   if (size.width === 0 && !errorShown.current && !platform.isJSDOM) {
  //     console.error(
  //       [
  //         'The parent DOM element of the Data Grid has an empty width.',
  //         'Please make sure that this element has an intrinsic width.',
  //         'The grid displays with a width of 0px.',
  //         '',
  //         'More details: https://mui.com/r/x-data-grid-no-dimensions.',
  //       ].join('\n'),
  //     );
  //     errorShown.current = true;
  //   }
  //
  //   if (isFirstSizing.current || !debouncedUpdateDimensions) {
  //     // We want to initialize the grid dimensions as soon as possible to avoid flickering
  //     isFirstSizing.current = false;
  //     updateDimensions();
  //   } else {
  //     debouncedUpdateDimensions();
  //   }
  // });

  return {
    updateDimensions,
    debouncedUpdateDimensions,
    isFirstSizing,
    rootDimensionsRef,
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
