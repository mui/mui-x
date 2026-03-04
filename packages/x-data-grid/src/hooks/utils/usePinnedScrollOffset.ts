import { Virtualization } from '@mui/x-virtualizer';
import { PinnedColumnPosition } from '../../internals/constants';
import { useGridPrivateApiContext } from './useGridPrivateApiContext';

export function usePinnedScrollOffset(
  apiRef: ReturnType<typeof useGridPrivateApiContext>,
  pinnedPosition?: PinnedColumnPosition,
) {
  const store = apiRef.current.virtualizer.store;

  // SAFETY: For performance reasons, we only add a store selector for pinned cells. A pinned cell can
  // never change to unpinned, so the hook is stable even though conditional.
  /* eslint-disable react-hooks/rules-of-hooks */

  if (pinnedPosition === PinnedColumnPosition.LEFT) {
    return store.use(Virtualization.selectors.pinnedLeftOffsetSelector);
  }
  if (pinnedPosition === PinnedColumnPosition.RIGHT) {
    return store.use(Virtualization.selectors.pinnedRightOffsetSelector);
  }

  /* eslint-enable react-hooks/rules-of-hooks */

  return 0;
}
