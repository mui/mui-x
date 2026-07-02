import type { ChartState, ProcessedSeries } from '@mui/x-charts/internals';
import { selectorAllSeriesOfType, selectorChartSeriesLayout } from '@mui/x-charts/internals';
import type {
  TreemapItemIdentifierWithData,
  TreemapLayout,
  TreemapLayoutNode,
} from '../treemap.types';

function contains(node: TreemapLayoutNode<true>, point: { x: number; y: number }) {
  return point.x >= node.x0 && point.x < node.x1 && point.y >= node.y0 && point.y < node.y1;
}

/**
 * Resolves the treemap tile under a pointer position by descending the layout from the
 * root into the deepest child whose rectangle contains the point. This lets the chart use
 * a single surface listener instead of a pointer/click handler per tile.
 */
export default function getItemAtPosition(
  state: ChartState<[]>,
  point: { x: number; y: number },
): TreemapItemIdentifierWithData | undefined {
  const series = selectorAllSeriesOfType(state, 'treemap') as ProcessedSeries['treemap'];
  const seriesId = series?.seriesOrder[0];
  if (seriesId === undefined || !series) {
    return undefined;
  }

  const layout = selectorChartSeriesLayout(state)?.treemap?.[seriesId]?.treemapLayout as
    | TreemapLayout<true>
    | undefined;
  if (!layout) {
    return undefined;
  }

  let node = layout.byId.get(layout.rootId);
  while (node) {
    const child = node.childrenIds
      .map((id) => layout.byId.get(id))
      .find((candidate) => candidate !== undefined && contains(candidate, point));
    if (!child) {
      break;
    }
    node = child;
  }

  // The (possibly synthetic) root at depth 0 is never rendered.
  if (!node || node.depth < 1) {
    return undefined;
  }

  return { type: 'treemap', seriesId, nodeId: node.id, node };
}
