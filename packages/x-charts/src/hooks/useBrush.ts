import {
  selectorBrushState,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

/**
 * Get the current brush state.
 *
 * - `start` is the starting point of the brush selection.
 * - `current` is the current point of the brush selection.
 *
 * @returns `{ start, current }` - The brush state.
 */
export function useBrush() {
  const store = useStore<[UseChartBrushSignature]>();

  return useSelector(store, selectorBrushState);
}
