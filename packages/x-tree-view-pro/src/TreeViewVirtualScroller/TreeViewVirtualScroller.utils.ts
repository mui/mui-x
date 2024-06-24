import { UseTreeViewVirtualizationRenderContext } from '../internals/plugins/useTreeViewVirtualization';

export enum ScrollDirection {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export const createScrollCache = (scrollBufferPx: number, verticalBuffer: number) => ({
  direction: ScrollDirection.NONE,
  buffer: bufferForDirection(ScrollDirection.NONE, scrollBufferPx, verticalBuffer),
});

export function bufferForDirection(
  direction: ScrollDirection,
  scrollBufferPx: number,
  verticalBuffer: number,
) {
  switch (direction) {
    case ScrollDirection.NONE:
      return {
        rowAfter: scrollBufferPx,
        rowBefore: scrollBufferPx,
      };
    case ScrollDirection.LEFT:
      return {
        rowAfter: 0,
        rowBefore: 0,
      };
    case ScrollDirection.RIGHT:
      return {
        rowAfter: 0,
        rowBefore: 0,
      };
    case ScrollDirection.UP:
      return {
        rowAfter: 0,
        rowBefore: verticalBuffer,
      };
    case ScrollDirection.DOWN:
      return {
        rowAfter: verticalBuffer,
        rowBefore: 0,
      };
    default:
      // eslint unable to figure out enum exhaustiveness
      throw new Error('unreachable');
  }
}

export function directionForDelta(dx: number, dy: number) {
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

export function areRenderContextsEqual(
  context1: UseTreeViewVirtualizationRenderContext,
  context2: UseTreeViewVirtualizationRenderContext,
) {
  if (context1 === context2) {
    return true;
  }
  return (
    context1.firstItemIndex === context2.firstItemIndex &&
    context1.lastItemIndex === context2.lastItemIndex
  );
}
