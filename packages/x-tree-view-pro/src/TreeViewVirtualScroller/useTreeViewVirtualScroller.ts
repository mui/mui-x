import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useTimeout from '@mui/utils/useTimeout';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useTreeViewContext, UseTreeViewItemsSignature } from '@mui/x-tree-view/internals';
import {
  UseTreeViewVirtualizationSignature,
  UseTreeViewVirtualizationRenderContext,
  UseTreeViewVirtualizationScrollDirection,
} from '../internals/plugins/useTreeViewVirtualization';
import { getDirectionFromDelta, areRenderContextsEqual } from './TreeViewVirtualScroller.utils';
import { TreeViewVirtualizationScrollPosition } from './TreeViewVirtualScroller.types';
import { useRunOnce } from './useRunOnce';

const EMPTY_RENDER_CONTEXT: UseTreeViewVirtualizationRenderContext = {
  firstItemIndex: 0,
  lastItemIndex: 0,
};

const EMPTY_SCROLL_POSITION: TreeViewVirtualizationScrollPosition = { top: 0, left: 0 };

export const useTreeViewVirtualScroller = () => {
  const {
    instance,
    rootRef,
    virtualization: { virtualScrollerRef, itemsHeight },
  } = useTreeViewContext<[UseTreeViewVirtualizationSignature, UseTreeViewItemsSignature]>();
  const scrollTimeout = useTimeout();
  const scrollDirectionRef = React.useRef<UseTreeViewVirtualizationScrollDirection>('none');
  const [renderContext, setRenderContext] =
    React.useState<UseTreeViewVirtualizationRenderContext>(EMPTY_RENDER_CONTEXT);
  const dimensions = instance.getDimensions();
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

    const direction = isScrolling ? getDirectionFromDelta(dx, dy) : 'none';

    // Since the previous render, we have scrolled...
    const verticalScroll = Math.abs(
      scrollPosition.current.top - previousContextScrollPosition.current.top,
    );

    const didCrossThreshold = verticalScroll >= itemsHeight;
    const didChangeDirection = scrollDirectionRef.current !== direction;
    const shouldUpdate = didCrossThreshold || didChangeDirection;

    if (!shouldUpdate) {
      return;
    }

    scrollDirectionRef.current = direction;

    const nextRenderContext = instance.computeRenderContext({
      scrollPositionPx: scrollPosition.current.top,
      scrollDirection: scrollDirectionRef.current,
    });

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

  useRunOnce(dimensions.viewportHeight !== 0, () => {
    const initialRenderContext = instance.computeRenderContext({
      scrollPositionPx: scrollPosition.current.top,
      scrollDirection: 'none',
    });
    updateRenderContext(initialRenderContext);
  });

  const getRootProps = () => ({});

  const getScrollerProps = () => ({
    ref: virtualScrollerRef,
    tabIndex: -1,
    onScroll: handleScroll,
    style: { overflowX: 'hidden' } as React.CSSProperties,
    role: 'presentation',
  });

  const getContentProps = () => ({
    style: { height: dimensions.contentSize } as React.CSSProperties,
    role: 'presentation',
  });

  const getRenderZoneProps = () => ({
    style: {
      transform: `translate3d(0, ${renderContext.firstItemIndex * itemsHeight}px, 0)`,
      role: 'presentation',
    },
  });

  const getScrollbarProps = () => ({ role: 'presentation' });

  const getItemsToRender = () => {
    return instance.getItemsToRenderWithVirtualization(renderContext);
  };

  return {
    getRootProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
    getScrollbarProps,
    getItemsToRender,
  };
};
