import {
  UseTreeViewVirtualizationRenderContext,
  UseTreeViewVirtualizationScrollDirection,
} from '../internals/plugins/useTreeViewVirtualization';

export function getDirectionFromDelta(
  dx: number,
  dy: number,
): UseTreeViewVirtualizationScrollDirection {
  if (dx === 0 && dy === 0) {
    return 'none';
  }
  /* eslint-disable */
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy > 0) {
      return 'down';
    } else {
      return 'up';
    }
  } else {
    if (dx > 0) {
      return 'right';
    } else {
      return 'left';
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
