import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { useTreeViewContext, UseTreeViewItemsSignature } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from '../internals/plugins/useTreeViewVirtualization';
import {
  createScrollCache,
  bufferForDirection,
  directionForDelta,
  ScrollDirection,
} from './TreeViewVirtualScroller.utils';

export const useTreeViewVirtualScroller = () => {
  const {
    instance,
    virtualization: { virtualScrollerRef, scrollBufferPx, itemsHeight },
  } = useTreeViewContext<[UseTreeViewVirtualizationSignature, UseTreeViewItemsSignature]>();
  const scrollTimeout = useTimeout();
  const rootRef = React.useRef<HTMLUListElement>(null);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollCache = useLazyRef(() => createScrollCache(scrollBufferPx, itemsHeight * 15)).current;

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
  const scrollPosition = React.useRef(EMPTY_SCROLL_POSITION);
  const previousContextScrollPosition = React.useRef(EMPTY_SCROLL_POSITION);

  const triggerUpdateRenderContext = () => {
    const newScroll = {
      top: virtualScrollerRef.current!.scrollTop,
      left: virtualScrollerRef.current!.scrollLeft,
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
    const didCrossThreshold = rowScroll >= itemsHeight || columnScroll >= MINIMUM_COLUMN_WIDTH;
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
    scrollCache.buffer = bufferForDirection(direction, scrollBufferPx, itemsHeight * 15);

    const inputs = inputsSelector(apiRef, rootProps, enabled, enabledForColumns);
    const nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);

    // Prevents batching render context changes
    ReactDOM.flushSync(() => {
      updateRenderContext(nextRenderContext);
    });

    scrollTimeout.start(1000, triggerUpdateRenderContext);

    return nextRenderContext;
  };

  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const { scrollTop, scrollLeft } = event.currentTarget;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (scrollTop < 0) {
      return;
    }

    // const nextRenderContext = triggerUpdateRenderContext();

    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollTop,
      left: scrollLeft,
      renderContext: nextRenderContext,
    });
  });

  const getRootProps = () => ({ ref: rootRef });

  const getContentProps = () => ({ ref: virtualScrollerRef, onScroll: handleScroll });

  const getScrollbarProps = () => ({ ref: scrollbarRef });

  const getItemsToRender = () => {
    // TODO: Add actual virtualization
    return instance.getItemsToRender();
  };

  return {
    getRootProps,
    getContentProps,
    getScrollbarProps,
    getItemsToRender,
  };
};
