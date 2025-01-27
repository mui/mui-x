'use client';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
} from '../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.selectors';

/**
 * A hook to check the highlighted state of multiple items.
 * If you're interested by a single one, consider using `useItemHighlighted`.
 *
 * Warning: highlighted and faded can both be true at the same time.
 * We recommend to first test if item is highlighted: `const faded = !highlighted && isFaded(item)`
 * @returns {{ isHighlighted, isFaded }} callbacks to get the state of the item.
 */
export function useItemHighlightedGetter() {
  const store = useStore();

  const isHighlighted = useSelector(store, selectorChartsIsHighlightedCallback);
  const isFaded = useSelector(store, selectorChartsIsFadedCallback);
  return {
    isHighlighted,
    isFaded,
  };
}
