'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartsFocusedItem } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';

/**
 * Get the focused item from keyboard navigation.
 */
export function useFocusedItem() {
  const store = useStore();
  return store.use(selectorChartsFocusedItem);
}
