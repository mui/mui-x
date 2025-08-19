'use client';
import { sankey, type SankeyGraph, sankeyLinkHorizontal } from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import type { Theme } from '@mui/material/styles';
import type {
  SankeySeriesType,
  SankeyLayout,
  SankeyNode,
  SankeyLink,
  SankeyLayoutLink,
  SankeyLayoutNode,
  DefaultizedSankeySeriesType,
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
  data: DefaultizedSankeySeriesType['data'],
  drawingArea: ChartDrawingArea,
  theme: Theme,
  series: Pick<SankeySeriesType, 'nodeOptions' | 'linkOptions' | 'iterations'> = {},
): SankeyLayout {
  const { iterations = 6, nodeOptions, linkOptions } = series;
  const {
    width: nodeWidth = 15,
    padding: nodePadding = 10,
    align: nodeAlign = 'justify',
    sort: nodeSort = null,
  } = nodeOptions ?? {};

  const { color: linkColor = (theme.vars || theme).palette.text.primary, sort: linkSort = null } =
    linkOptions ?? {};

  const { width, height, left, top, bottom, right } = drawingArea;
  if (!data || !data.links) {
    return { nodes: [], links: [] };
  }

  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: data.nodes
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
  } catch (error) {
    // There are two errors that can occur:
    // 1. If the data contains circular references, d3-sankey will throw an error.
    // 2. If there are missing source/target nodes, d3-sankey will throw an error.
    // We handle the second case by building a map of nodes ourselves, so they are always present.
    if (error instanceof Error && error.message === 'circular link') {
      throw new Error('MUI X Charts: Sankey diagram contains circular references.');
    }

    throw error;
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
    const originalNode = data.nodes.get(node.id) || {};
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
