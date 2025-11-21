import { type UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import {
  selectorChartsHighlightXAxisValue,
  selectorChartsHighlightYAxisValue,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

/**
 * Returns whether the X axis highlight is currently active.
 *
 * @returns `true` if the highlight is active, `false` otherwise.
 */
export function useIsXAxisHighlightActive(): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const xValue = useSelector(store, selectorChartsHighlightXAxisValue);

  return xValue.length > 0;
}

/**
 * Returns whether the Y axis highlight is currently active.
 *
 * @returns `true` if the highlight is active, `false` otherwise.
 */
export function useIsYAxisHighlightActive(): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const yValue = useSelector(store, selectorChartsHighlightYAxisValue);

  return yValue.length > 0;
}

/**
 * Returns whether any highlight is currently active.
 *
 * @returns `true` if the highlight is active, `false` otherwise.
 */
export function useIsAnyAxisHighlightActive(): boolean {
  const x = useIsXAxisHighlightActive();
  const y = useIsYAxisHighlightActive();

  return x || y;
}
