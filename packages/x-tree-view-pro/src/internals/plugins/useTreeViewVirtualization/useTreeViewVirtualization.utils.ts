import {
  UseTreeViewVirtualizationElementSize,
  UseTreeViewVirtualizationScrollDirection,
} from './useTreeViewVirtualization.types';

export function areElementSizesEqual(
  a: UseTreeViewVirtualizationElementSize,
  b: UseTreeViewVirtualizationElementSize,
) {
  return a.width === b.width && a.height === b.height;
}

export function getBufferFromScrollDirection({
  scrollBufferPx,
  verticalBuffer,
  scrollDirection,
}: {
  scrollBufferPx: number;
  verticalBuffer: number;
  scrollDirection: UseTreeViewVirtualizationScrollDirection;
}) {
  switch (scrollDirection) {
    case 'none':
      return {
        itemsAfter: scrollBufferPx,
        itemsBefore: scrollBufferPx,
      };
    case 'left':
      return {
        itemsAfter: 0,
        itemsBefore: 0,
      };
    case 'right':
      return {
        itemsAfter: 0,
        itemsBefore: 0,
      };
    case 'up':
      return {
        itemsAfter: 0,
        itemsBefore: verticalBuffer,
      };
    case 'down':
      return {
        itemsAfter: verticalBuffer,
        itemsBefore: 0,
      };
    default:
      // eslint unable to figure out enum exhaustiveness
      throw new Error('unreachable');
  }
}
