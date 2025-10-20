import {
  selectorBrushShouldPreventTooltip,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

/**
 * Returns whether the tooltip is currently active.
 * The tooltip is considered inactive when interactions like brush are preventing it.
 *
 * @returns `true` if the tooltip is active, `false` otherwise.
 */
export function useIsTooltipActive(): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const shouldPreventTooltip = useSelector(store, selectorBrushShouldPreventTooltip);

  return !shouldPreventTooltip;
}
