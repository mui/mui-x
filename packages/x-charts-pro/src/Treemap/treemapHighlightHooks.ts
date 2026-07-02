import { createSelector } from '@mui/x-internals/store';
import {
  useStore,
  selectorChartsHighlightedItem,
  selectorChartSeriesLayout,
  selectorChartsHighlightScopePerSeriesId,
} from '@mui/x-charts/internals';
import type { TreemapItemIdentifier } from './treemap.types';
import { isTreemapNodeHighlighted } from './utils';

/**
 * Computes the highlight state of a treemap tile. Unlike the generic highlight helpers,
 * this reads the computed layout so it can resolve hierarchy-aware scopes
 * (`children`, `parents`, `parent`, `child`) from the hovered tile.
 */
const selectorTreemapItemHighlightState = createSelector(
  selectorChartsHighlightedItem,
  selectorChartSeriesLayout,
  selectorChartsHighlightScopePerSeriesId,
  function selectorTreemapItemHighlightState(
    highlightedItem,
    seriesLayout,
    scopePerSeriesId,
    identifier: TreemapItemIdentifier,
  ): 'highlighted' | 'faded' | undefined {
    if (
      !highlightedItem ||
      highlightedItem.type !== 'treemap' ||
      highlightedItem.seriesId !== identifier.seriesId
    ) {
      return undefined;
    }

    const layout = seriesLayout?.treemap?.[identifier.seriesId]?.treemapLayout;
    if (!layout) {
      return undefined;
    }

    const scope = scopePerSeriesId.treemap?.get(identifier.seriesId);
    const highlight = scope?.highlight ?? 'node';
    const fade = scope?.fade ?? 'none';
    const { nodeId: hoveredId } = highlightedItem;

    if (isTreemapNodeHighlighted(layout, highlight, hoveredId, identifier.nodeId)) {
      return 'highlighted';
    }
    if (fade === 'none') {
      return undefined;
    }
    // `global` fades everything that isn't highlighted; otherwise the fade follows the
    // same hierarchy scopes as the highlight.
    if (fade === 'global') {
      return 'faded';
    }
    if (isTreemapNodeHighlighted(layout, fade, hoveredId, identifier.nodeId)) {
      return 'faded';
    }
    return undefined;
  },
);

export function useTreemapItemHighlightState(identifier: TreemapItemIdentifier) {
  const store = useStore();

  return store.use(selectorTreemapItemHighlightState, identifier);
}
