'use client';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
  type SankeyLink,
  type SankeyNode,
  type SankeyValueType,
} from './sankey.types';
import { findCycles } from './findCycles';

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
  if (!data || !data.nodes || !data.links || data.nodes.length === 0) {
    return { nodes: [], links: [] };
  }

  // TODO: Should we check only in prod? We could also throw or provide an "onCycleError" callback
  // to handle cycles differently.
  const circularLinks = findCycles(data);

  // Create the sankey layout generator
  const sankeyGenerator = sankey<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>()
    .nodeWidth(nodeWidth)
    .nodePadding(nodeGap)
    // TODO: make this configurable
    .nodeAlign(sankeyJustify)
    .extent([
      // TODO: gotta take margins into account
      [left, top],
      [width + right, height + bottom],
    ])
    .nodeId((d) => d.id)
    .iterations(iterations);

  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: data.nodes.map((v) => ({ ...v })),
    links: data.links.filter((link) => !circularLinks.includes(link)).map((v) => ({ ...v })),
  };

  // Generate the layout
  const result = sankeyGenerator(graph);
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
    const originalNode = data.nodes.find((n) => n.id === node.id);
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
