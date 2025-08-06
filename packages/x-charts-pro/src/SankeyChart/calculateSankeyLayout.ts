'use client';
import { sankey, type SankeyGraph, sankeyLinkHorizontal } from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import type { Theme } from '@mui/material/styles';
import type {
  SankeyData,
  SankeySeriesType,
  SankeyLayout,
  NodeId,
  SankeyNode,
  SankeyLink,
  SankeyLayoutLink,
  SankeyLayoutNode,
} from './sankey.types';
import { getNodeAlignFunction } from './utils';

/**
 * Calculates the layout for a Sankey diagram using d3-sankey
 *
 * @param data The Sankey data (nodes and links)
 * @param drawingArea The drawing area dimensions
 * @param options Layout configuration options
 * @returns The calculated layout
 */

export function calculateSankeyLayout(
  data: SankeyData,
  drawingArea: ChartDrawingArea,
  theme: Theme,
  options: Pick<SankeySeriesType, 'nodeOptions' | 'linkOptions' | 'iterations'> = {},
): SankeyLayout {
  const { iterations = 32, nodeOptions, linkOptions } = options;
  const {
    width: nodeWidth = 15,
    padding: nodePadding = 10,
    align: nodeAlign = 'justify',
    sort: nodeSort = null,
    color: nodeColor = theme.palette.primary.main,
  } = nodeOptions ?? {};

  const { color: linkColor = theme.palette.primary.light, sort: linkSort = null } =
    linkOptions ?? {};

  const { width, height, left, top, bottom, right } = drawingArea;
  if (!data || !data.links) {
    return { nodes: [], links: [] };
  }

  const nodeMap = new Map<NodeId, SankeyNode>();

  data.links.forEach((v) => {
    if (!nodeMap.has(v.source)) {
      const sourceNode = data.nodes?.[v.source];
      const source = sourceNode
        ? { label: `${v.source}`, ...sourceNode, id: v.source }
        : { id: v.source, label: `${v.source}` };
      nodeMap.set(source.id, source);
    }

    if (!nodeMap.has(v.target)) {
      const targetNode = data.nodes?.[v.target];
      const target = targetNode
        ? { label: `${v.target}`, ...targetNode, id: v.target }
        : { id: v.target, label: `${v.target}` };
      nodeMap.set(target.id, target);
    }
  });

  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: nodeMap
      .values()
      .toArray()
      .map((v) => ({ ...v })),
    links: data.links.map((v) => ({ ...v })),
  };

  // Create the sankey layout generator
  let sankeyGenerator = sankey<typeof graph, SankeyLayoutNode, SankeyLayoutLink>()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeAlign(getNodeAlignFunction(nodeAlign))
    .extent([
      [left, top],
      [width + right, height + bottom],
    ])
    .nodeId((d) => d.id)
    .iterations(iterations);

  if (nodeSort) {
    sankeyGenerator = sankeyGenerator.nodeSort(nodeSort);
  }
  if (linkSort) {
    sankeyGenerator = sankeyGenerator.linkSort(linkSort);
  }

  // Generate the layout
  let result: SankeyGraph<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>;
  try {
    result = sankeyGenerator(graph);
  } catch (_) {
    // There are two errors that can occur:
    // 1. If the data contains circular references, d3-sankey will throw an error.
    // 2. If there are missing source/target nodes, d3-sankey will throw an error.
    // We handle the second case by building a map of nodes ourselves, so they are always present.
    throw new Error('MUI X Charts: Sankey diagram contains circular references.');
  }
  const { nodes, links } = result;

  // Link path generator
  const linkGenerator = sankeyLinkHorizontal();

  // Convert d3-sankey links to our format
  // Cast to SankeyLayoutLink as it has the correct properties
  const layoutLinks: SankeyLayoutLink[] = (links as SankeyLayoutLink[]).map((link) => {
    // Get the original link data
    const originalLink = data.links.find((l) => {
      return l.source === link.source.id && l.target === link.target.id;
    });

    return {
      color: linkColor,
      ...originalLink,
      ...link,
      path: linkGenerator(link),
    };
  });

  const layoutNodes: SankeyLayoutNode[] = nodes.map((node) => {
    const originalNode = nodeMap.get(node.id) || {};
    return {
      color: nodeColor,
      ...originalNode,
      ...node,
    };
  });

  return {
    nodes: layoutNodes,
    links: layoutLinks,
  };
}
