import type { RefObject } from '@mui/x-internals/types';
import ownerWindow from '@mui/utils/ownerWindow';
import {
  getEdgeScrollDelta,
  getVisibleViewportBounds,
  gridDimensionsSelector,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../models/gridApiPro';

export interface GridScrollableCellsBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Returns the edges of the scrollable cells in client coordinates: inside of the headers,
 * the pinned rows and columns, and the scrollbars.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {DOMRect} scrollerRect The bounding rect of the virtual scroller.
 * @returns {GridScrollableCellsBounds} The edges of the scrollable cells.
 */
export function getGridScrollableCellsBounds(
  apiRef: RefObject<GridPrivateApiPro>,
  scrollerRect: DOMRect,
): GridScrollableCellsBounds {
  const dimensions = gridDimensionsSelector(apiRef);
  const isRtl = apiRef.current.state.isRtl;
  const scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
  const scrollbarHeight = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
  // In RTL, the left pinned columns are on the right side and the vertical scrollbar on the left
  return {
    top: scrollerRect.top + dimensions.topContainerHeight,
    bottom: scrollerRect.bottom - dimensions.bottomContainerHeight - scrollbarHeight,
    left:
      scrollerRect.left +
      (isRtl ? dimensions.rightPinnedWidth + scrollbarWidth : dimensions.leftPinnedWidth),
    right:
      scrollerRect.right -
      (isRtl ? dimensions.leftPinnedWidth : dimensions.rightPinnedWidth + scrollbarWidth),
  };
}

export interface GridPointerDragAutoScrollOptions {
  clientX: number;
  clientY: number;
  /**
   * The axes that scroll. On an axis that doesn't, the pointer must be over the scroller.
   */
  axis: 'x' | 'y' | 'both';
}

export interface GridPointerDragAutoScrollDelta {
  deltaX: number;
  deltaY: number;
}

const NO_SCROLL: GridPointerDragAutoScrollDelta = { deltaX: 0, deltaY: 0 };

/**
 * Scrolls the grid during a pointer drag when the pointer is close to an edge of the scrollable cells.
 * When the grid can't scroll further, or at all with `autoHeight`, scrolls the page instead
 * if the pointer is at the edge of the screen.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {HTMLElement} scroller The virtual scroller.
 * @param {GridPointerDragAutoScrollOptions} options The pointer position and the axes that scroll.
 * @returns {GridPointerDragAutoScrollDelta} The scroll applied on each axis, to the grid or the page. `0` when that axis didn't scroll.
 */
export function autoScrollGridOnPointerDrag(
  apiRef: RefObject<GridPrivateApiPro>,
  scroller: HTMLElement,
  options: GridPointerDragAutoScrollOptions,
): GridPointerDragAutoScrollDelta {
  const { clientX, clientY, axis } = options;
  const canScrollX = axis !== 'y';
  const canScrollY = axis !== 'x';
  const rect = scroller.getBoundingClientRect();
  if (
    (!canScrollX && (clientX < rect.left || clientX > rect.right)) ||
    (!canScrollY && (clientY < rect.top || clientY > rect.bottom))
  ) {
    return NO_SCROLL;
  }

  const bounds = getGridScrollableCellsBounds(apiRef, rect);
  // The page doesn't scroll during a touch drag, so a zone off-screen couldn't be reached
  const win = ownerWindow(scroller);
  const viewport = getVisibleViewportBounds(win);
  const deltaY = canScrollY
    ? getEdgeScrollDelta(
        clientY,
        Math.max(bounds.top, viewport.top),
        Math.min(bounds.bottom, viewport.bottom),
      )
    : 0;
  const deltaX = canScrollX
    ? getEdgeScrollDelta(
        clientX,
        Math.max(bounds.left, viewport.left),
        Math.min(bounds.right, viewport.right),
      )
    : 0;
  if (deltaX === 0 && deltaY === 0) {
    return NO_SCROLL;
  }

  const { top, left } = apiRef.current.getScrollPosition();
  // Only the axis that moves is passed, so the other one can't jump.
  // `scroll` takes the distance from the start edge and flips it in RTL, where `scrollLeft` is negative.
  apiRef.current.scroll({
    ...(deltaY !== 0 && { top: top + deltaY }),
    ...(deltaX !== 0 && { left: (apiRef.current.state.isRtl ? -1 : 1) * (left + deltaX) }),
  });

  // The grid can't scroll further: scroll the page when the pointer is at the edge of the screen
  const position = apiRef.current.getScrollPosition();
  const hasScrolledY = position.top !== top;
  const hasScrolledX = position.left !== left;
  const isAtScreenEdgeY = deltaY < 0 ? viewport.top > bounds.top : viewport.bottom < bounds.bottom;
  const isAtScreenEdgeX = deltaX < 0 ? viewport.left > bounds.left : viewport.right < bounds.right;
  const pageDeltaY = deltaY !== 0 && !hasScrolledY && isAtScreenEdgeY ? deltaY : 0;
  const pageDeltaX = deltaX !== 0 && !hasScrolledX && isAtScreenEdgeX ? deltaX : 0;
  if (pageDeltaX !== 0 || pageDeltaY !== 0) {
    win.scrollBy(pageDeltaX, pageDeltaY);
  }

  return {
    deltaX: hasScrolledX || pageDeltaX !== 0 ? deltaX : 0,
    deltaY: hasScrolledY || pageDeltaY !== 0 ? deltaY : 0,
  };
}
