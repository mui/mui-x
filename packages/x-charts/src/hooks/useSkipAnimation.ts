'use client';
import { selectorChartSkipAnimation } from '../internals/plugins/corePlugins/useChartAnimation';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';

/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean} whether to skip animations
 */
export function useSkipAnimation(skipAnimation?: boolean): boolean {
  const store = useStore();
  const storeSkipAnimation = useSelector(store, selectorChartSkipAnimation);

  return skipAnimation || storeSkipAnimation;
}
