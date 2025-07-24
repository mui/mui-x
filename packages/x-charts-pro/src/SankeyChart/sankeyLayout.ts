'use client';
import { 
  sankey, 
  sankeyLinkHorizontal, 
  sankeyJustify,
  SankeyGraph as D3SankeyGraph,
  SankeyLink as D3SankeyLink,
  SankeyNode as D3SankeyNode
} from '@mui/x-charts-vendor/d3-sankey';
import {
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
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
  width: number,
  height: number,
  nodeWidth: number = 15,
  nodeGap: number = 10,
  iterations: number = 32,
): SankeyLayout {
  if (!data || !data.nodes || !data.links || data.nodes.length === 0) {
    return { nodes: [], links: [] };
  }

  // Create a copy of the data to avoid modifying the original
  const sankeyNodes = data.nodes.map(node => ({
    ...node,
    // Add required d3-sankey node properties
    index: 0, // Will be set by d3-sankey
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    value: 0,
    depth: 0,
  }));
  
  // Create a node id to index mapping
  const nodeById = new Map<string | number, number>();
  sankeyNodes.forEach((node, i) => {
    nodeById.set(node.id, i);
    // Set index for d3-sankey
    node.index = i;
  });
  
  // Create link objects for d3-sankey (needs references to actual node objects)
  const sankeyLinks = data.links.map(link => {
    const sourceIndex = nodeById.get(link.source);
    const targetIndex = nodeById.get(link.target);
    
    if (sourceIndex === undefined || targetIndex === undefined) {
      throw new Error(
        `Invalid link: source or target node not found (${link.source} -> ${link.target})`,
      );
    }
    
    return {
      ...link,
      source: sourceIndex,
      target: targetIndex,
      value: link.value,
    };
  });

  // Create the sankey layout generator
  const sankeyGenerator = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodeGap)
    .nodeAlign(sankeyJustify)
    .extent([[0, 0], [width, height]])
    .iterations(iterations);
  
  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: sankeyNodes,
    links: sankeyLinks
  };

  // Generate the layout
  const result = sankeyGenerator(graph) as unknown as D3SankeyGraph<{}, {}>;
  const { nodes, links } = result;

  // Link path generator
  const linkGenerator = sankeyLinkHorizontal();
  
  // Convert d3-sankey links to our format
  const layoutLinks: SankeyLayoutLink[] = links.map((link) => {
    // d3-sankey modifies the source/target to be objects
    const d3Link = link as unknown as D3SankeyLink<{}, {}>;
    const sourceNode = d3Link.source as unknown as D3SankeyNode<{}, {}> & { id: string | number };
    const targetNode = d3Link.target as unknown as D3SankeyNode<{}, {}> & { id: string | number };
    
    // Get the original link data
    const originalLink = data.links.find(l => 
      l.source === sourceNode.id && l.target === targetNode.id);
    
    return {
      source: sourceNode.id,
      target: targetNode.id,
      value: d3Link.value,
      data: originalLink?.data,
      color: originalLink?.color,
      width: Math.max(1, d3Link.width || d3Link.value),
      sourceNode: sourceNode as unknown as SankeyLayoutNode,
      targetNode: targetNode as unknown as SankeyLayoutNode,
      path: linkGenerator(d3Link) || '',
    };
  });

  return { 
    nodes: nodes as unknown as SankeyLayoutNode[], 
    links: layoutLinks 
  };
}
