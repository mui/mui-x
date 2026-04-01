import { Virtualization } from '@mui/x-virtualizer';
import { PinnedColumnPosition } from '../../internals/constants';
import type { useGridPrivateApiContext } from './useGridPrivateApiContext';

export function usePinnedScrollOffset(
  apiRef: ReturnType<typeof useGridPrivateApiContext>,
  pinnedPosition?: PinnedColumnPosition,
) {
  const store = apiRef.current.virtualizer.store;

  // SAFETY: For performance reasons, we only add store selectors for pinned cells in controlled
  // mode. Both pinnedPosition and layoutMode are stable (never change for a given instance),
  // so the hook call order is consistent across renders.
  if (pinnedPosition !== undefined) {
    const layoutMode = store.use(Virtualization.selectors.layoutMode);
    if (layoutMode === 'controlled') {
      if (pinnedPosition === PinnedColumnPosition.LEFT) {
        return store.use(Virtualization.selectors.pinnedLeftOffsetSelector);
      }
      if (pinnedPosition === PinnedColumnPosition.RIGHT) {
        return store.use(Virtualization.selectors.pinnedRightOffsetSelector);
      }
    }
  }

  return 0;
}
