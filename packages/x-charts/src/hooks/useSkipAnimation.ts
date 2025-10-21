'use client';
import { useStore } from '@mui/x-internals/store';
import { selectorChartSkipAnimation } from '../internals/plugins/corePlugins/useChartAnimation';
import { useChartStore } from '../internals/store/useChartStore';

/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean} whether to skip animations
 */
export function useSkipAnimation(skipAnimation?: boolean): boolean {
  const store = useChartStore();
  const storeSkipAnimation = useStore(store, selectorChartSkipAnimation);

  return skipAnimation || storeSkipAnimation;
}
