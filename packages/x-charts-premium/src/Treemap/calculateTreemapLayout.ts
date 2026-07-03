'use client';
import { stratify, treemap } from '@mui/x-charts-vendor/d3-hierarchy';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import { getTilingMethod } from './utils';
import type {
  DefaultizedTreemapSeriesType,
  TreemapItemId,
  TreemapLayout,
  TreemapLayoutNode,
} from './treemap.types';

/**
 * Computes the positioned treemap layout from the normalized (position-less) series data,
 * within the given drawing area. All d3-hierarchy usage is contained in this module.
 */
export function calculateTreemapLayout(
  series: DefaultizedTreemapSeriesType,
  drawingArea: ChartDrawingArea,
): TreemapLayout<true> {
  const { data, tiling } = series;

  if (!data.nodes.length) {
    return { nodes: [], byId: new Map(), rootId: data.rootId };
  }

  let stratified;
  try {
    stratified = stratify<TreemapLayoutNode<false>>()
      .id((node) => String(node.id))
      .parentId((node) => (node.parentId == null ? null : String(node.parentId)))(
      data.nodes as TreemapLayoutNode<false>[],
    );
  } catch (error) {
    throw new Error(
      `MUI X Charts: Unable to build the treemap hierarchy.
This is usually caused by duplicate node ids or a node referencing a missing parent.
Ensure every node has a unique id (ids are coerced to strings, so 1 and '1' collide).`,
      { cause: error },
    );
  }

  // Reuse the values already summed in `getSeriesWithDefaultValues` rather than summing
  // again with a second, divergable rule; the tiling only needs `node.value` set.
  stratified.each((node) => {
    node.value = node.data.value;
  });

  const treemapGenerator = treemap<TreemapLayoutNode<false>>()
    .size([Math.max(0, drawingArea.width), Math.max(0, drawingArea.height)])
    .tile(getTilingMethod(tiling?.method))
    .round(true);

  if (tiling?.paddingInner != null) {
    treemapGenerator.paddingInner(tiling.paddingInner);
  }
  if (tiling?.paddingOuter != null) {
    treemapGenerator.paddingOuter(tiling.paddingOuter);
  }
  if (tiling?.paddingTop != null) {
    treemapGenerator.paddingTop(tiling.paddingTop);
  }

  const laidOut = treemapGenerator(stratified);

  const nodes: TreemapLayoutNode<true>[] = [];
  const byId = new Map<TreemapItemId, TreemapLayoutNode<true>>();
  laidOut.eachBefore((node) => {
    const out: TreemapLayoutNode<true> = {
      ...node.data,
      value: node.value ?? node.data.value,
      x0: drawingArea.left + node.x0,
      y0: drawingArea.top + node.y0,
      x1: drawingArea.left + node.x1,
      y1: drawingArea.top + node.y1,
    };
    nodes.push(out);
    byId.set(out.id, out);
  });

  return { nodes, byId, rootId: data.rootId };
}
