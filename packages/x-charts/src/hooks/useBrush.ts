import { useStore } from '@mui/x-internals/store';
import {
  selectorBrushState,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';

import { useChartStore } from '../internals/store/useChartStore';

/**
 * Get the current brush state.
 *
 * - `start` is the starting point of the brush selection.
 * - `current` is the current point of the brush selection.
 *
 * @returns `{ start, current }` - The brush state.
 */
export function useBrush() {
  const store = useChartStore<[UseChartBrushSignature]>();

  return useStore(store, selectorBrushState);
}
