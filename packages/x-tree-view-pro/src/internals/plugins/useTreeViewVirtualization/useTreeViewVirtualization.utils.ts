import { UseTreeViewVirtualizationElementSize } from './useTreeViewVirtualization.types';

export function areElementSizesEqual(
  a: UseTreeViewVirtualizationElementSize,
  b: UseTreeViewVirtualizationElementSize,
) {
  return a.width === b.width && a.height === b.height;
}
