import {
  selectorBrushShouldPreventAxisHighlight,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

/**
 * Returns whether the highlight is currently active.
 * The highlight is considered inactive when interactions like brush are preventing it.
 *
 * @returns `true` if the highlight is active, `false` otherwise.
 */
export function useIsHighlightActive(): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const shouldPreventHighlight = useSelector(store, selectorBrushShouldPreventAxisHighlight);

  return !shouldPreventHighlight;
}
