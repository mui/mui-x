import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { useTreeViewContext, UseTreeViewItemsSignature } from '@mui/x-tree-view/internals';
import {
  UseTreeViewVirtualizationSignature,
  UseTreeViewVirtualizationRenderContext,
} from '../internals/plugins/useTreeViewVirtualization';
import {
  createScrollCache,
  bufferForDirection,
  directionForDelta,
  ScrollDirection,
  areRenderContextsEqual,
} from './TreeViewVirtualScroller.utils';
import { TreeViewVirtualizationScrollPosition } from './TreeViewVirtualScroller.types';
import { useResizeObserver } from './useResizeObserver';
import { useRunOnce } from './useRunOnce';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

const EMPTY_RENDER_CONTEXT: UseTreeViewVirtualizationRenderContext = {
  firstItemIndex: 0,
  lastItemIndex: 0,
};

const EMPTY_SCROLL_POSITION: TreeViewVirtualizationScrollPosition = { top: 0, left: 0 };

export const useTreeViewVirtualScroller = () => {
  const {
    instance,
    rootRef,
    virtualization: { virtualScrollerRef, scrollBufferPx, itemsHeight },
  } = useTreeViewContext<[UseTreeViewVirtualizationSignature, UseTreeViewItemsSignature]>();
  const scrollTimeout = useTimeout();
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollCache = useLazyRef(() => createScrollCache(scrollBufferPx, itemsHeight * 15)).current;
  const [renderContext, setRenderContext] =
    React.useState<UseTreeViewVirtualizationRenderContext>(EMPTY_RENDER_CONTEXT);
  const frozenContext = React.useRef<UseTreeViewVirtualizationRenderContext | undefined>(undefined);

  useResizeObserver(rootRef, () => instance.handleResizeRoot());

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
  const scrollPosition = React.useRef<TreeViewVirtualizationScrollPosition>(EMPTY_SCROLL_POSITION);
  const previousContextScrollPosition =
    React.useRef<TreeViewVirtualizationScrollPosition>(EMPTY_SCROLL_POSITION);

  const updateRenderContext = (nextRenderContext: UseTreeViewVirtualizationRenderContext) => {
    if (areRenderContextsEqual(nextRenderContext, renderContext)) {
      return;
    }

    setRenderContext(nextRenderContext);
    previousContextScrollPosition.current = scrollPosition.current;
  };

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
    const verticalScroll = Math.abs(
      scrollPosition.current.top - previousContextScrollPosition.current.top,
    );

    // PERF: use the computed minimum column width instead of a static one
    const didCrossThreshold = verticalScroll >= itemsHeight;
    const didChangeDirection = scrollCache.direction !== direction;
    const shouldUpdate = didCrossThreshold || didChangeDirection;

    if (!shouldUpdate) {
      return;
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

    const nextRenderContext = instance.computeRenderContext(scrollPosition.current.top);

    // Prevents batching render context changes
    ReactDOM.flushSync(() => {
      updateRenderContext(nextRenderContext);
    });

    scrollTimeout.start(1000, triggerUpdateRenderContext);
  };

  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const { scrollTop } = event.currentTarget;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (scrollTop < 0) {
      return;
    }

    triggerUpdateRenderContext();
  });

  useEnhancedEffect(() => {
    instance.handleResizeRoot();
  }, [instance]);

  useRunOnce(instance.getDimensions().viewportHeight !== 0, () => {
    const initialRenderContext = instance.computeRenderContext(scrollPosition.current.top);
    updateRenderContext(initialRenderContext);
  });

  const getRootProps = () => ({});

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
