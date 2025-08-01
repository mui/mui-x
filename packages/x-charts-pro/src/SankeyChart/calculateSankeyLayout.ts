'use client';
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyJustify,
  type SankeyGraph,
} from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
  type NodeId,
  type SankeyLink,
  type SankeyNode,
  type SankeyValueType,
} from './sankey.types';

/**
 * Calculates the layout for a Sankey diagram using d3-sankey
 *
 * @param data The Sankey data (nodes and links)
 * @param width The width of the chart area
 * @param height The height of the chart area
 * @param nodeWidth The width of each node
 * @param nodeGap The gap between nodes in the same column
 * @param iterations The number of iterations for the layout algorithm
 * @returns The calculated layout
 */
export function calculateSankeyLayout(
  data: SankeyValueType,
  drawingArea: ChartDrawingArea,
  nodeWidth: number = 15,
  nodeGap: number = 10,
  iterations: number = 32,
): SankeyLayout {
  const { width, height, left, top, bottom, right } = drawingArea;
  if (!data || !data.links) {
    return { nodes: [], links: [] };
  }

  const nodeMap = new Map<NodeId, SankeyNode>();

  data.links.forEach((v) => {
    if (nodeMap.has(v.source) && nodeMap.has(v.target)) {
      return;
    }

    const sourceNode = data.nodes?.[v.source];
    const targetNode = data.nodes?.[v.target];

    const source = sourceNode
      ? { label: `${v.source}`, ...sourceNode, id: v.source }
      : { id: v.source, label: `${v.source}` };
    const target = targetNode
      ? { label: `${v.target}`, ...targetNode, id: v.target }
      : { id: v.target, label: `${v.target}` };

    nodeMap.set(source.id, source);
    nodeMap.set(target.id, target);
  });

  const computedNodes = nodeMap.values().toArray();

  // Create the sankey layout generator
  const sankeyGenerator = sankey<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>()
    .nodeWidth(nodeWidth)
    .nodePadding(nodeGap)
    // TODO: make this configurable
    .nodeAlign(sankeyJustify)
    .extent([
      [left, top],
      [width + right, height + bottom],
    ])
    .nodeId((d) => d.id)
    .iterations(iterations);

  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: computedNodes.map((v) => ({ ...v })),
    links: data.links.map((v) => ({ ...v })),
  };

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
      ...originalLink,
      ...link,
      path: linkGenerator(link),
    };
  });

  const layoutNodes: SankeyLayoutNode[] = nodes.map((node) => {
    const originalNode = nodeMap.get(node.id) || {};
    return {
      ...originalNode,
      ...node,
    };
  });

  return {
    nodes: layoutNodes,
    links: layoutLinks,
  };
}
