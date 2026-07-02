import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  useStore,
  selectorChartsHighlightedItem,
  selectorChartSeriesLayout,
  selectorChartsHighlightScopePerSeriesId,
} from '@mui/x-charts/internals';
import type { TreemapItemId } from './treemap.types';
import { collectTreemapScope } from './utils';

export type TreemapHighlightState = 'highlighted' | 'faded' | undefined;

const alwaysUndefined = () => undefined;

/**
 * Returns a getter `(nodeId) => 'highlighted' | 'faded' | undefined` computed once per
 * hover/layout/scope change. It precomputes the highlighted/faded sets from the hovered
 * tile (mirroring the core `selectorChartsHighlightStateCallback`), so the plot subscribes
 * once and each tile does an O(1) lookup — no per-tile store subscription or traversal.
 */
const selectorTreemapHighlightStateGetter = createSelectorMemoized(
  selectorChartsHighlightedItem,
  selectorChartSeriesLayout,
  selectorChartsHighlightScopePerSeriesId,
  (
    highlightedItem,
    seriesLayout,
    scopePerSeriesId,
  ): ((nodeId: TreemapItemId) => TreemapHighlightState) => {
    if (!highlightedItem || highlightedItem.type !== 'treemap') {
      return alwaysUndefined;
    }
    const { seriesId, nodeId: hoveredId } = highlightedItem;
    const layout = seriesLayout?.treemap?.[seriesId]?.treemapLayout;
    if (!layout) {
      return alwaysUndefined;
    }

    const scope = scopePerSeriesId.treemap?.get(seriesId);
    const highlight = scope?.highlight ?? 'node';
    const fade = scope?.fade ?? 'none';

    const highlightedSet = collectTreemapScope(layout, highlight, hoveredId);
    const fadedSet =
      fade === 'none' || fade === 'global' ? null : collectTreemapScope(layout, fade, hoveredId);

    return (nodeId) => {
      if (highlightedSet.has(nodeId)) {
        return 'highlighted';
      }
      if (fade === 'global') {
        return 'faded';
      }
      if (fadedSet?.has(nodeId)) {
        return 'faded';
      }
      return undefined;
    };
  },
);

/** Subscribes once to the treemap highlight getter. */
export function useTreemapHighlightGetter() {
  const store = useStore();

  return store.use(selectorTreemapHighlightStateGetter);
}
