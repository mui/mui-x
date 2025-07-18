'use client';
import {
  SankeyData,
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
  SankeyLink,
} from './sankey.types';

/**
 * Calculates the layout for a Sankey diagram
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
  data: SankeyData,
  width: number,
  height: number,
  nodeWidth: number = 15,
  nodeGap: number = 10,
  iterations: number = 32,
): SankeyLayout {
  if (!data || !data.nodes || !data.links || data.nodes.length === 0) {
    return { nodes: [], links: [] };
  }

  // Create a map of node IDs to their indices
  const nodeMap = new Map<string | number, number>();
  data.nodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
  });

  // Initialize nodes with layout information
  const nodes: SankeyLayoutNode[] = data.nodes.map((node) => ({
    ...node,
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    value: 0,
    depth: 0,
  }));

  // Initialize links and compute node values
  const links: SankeyLink[] = data.links.map((link) => {
    const sourceIndex = nodeMap.get(link.source);
    const targetIndex = nodeMap.get(link.target);

    if (sourceIndex === undefined || targetIndex === undefined) {
      throw new Error(
        `Invalid link: source or target node not found (${link.source} -> ${link.target})`,
      );
    }

    // Accumulate values for nodes
    nodes[sourceIndex].value = (nodes[sourceIndex].value || 0) + link.value;
    nodes[targetIndex].value = (nodes[targetIndex].value || 0) + link.value;

    return link;
  });

  // Compute depth (column) for each node
  computeNodeDepths(nodes, links, nodeMap);

  // Compute vertical positions for nodes
  computeNodeVerticalPositions(nodes, height, nodeGap);

  // Compute horizontal positions for nodes
  computeNodeHorizontalPositions(nodes, width, nodeWidth);

  // Optimize node positions to reduce link crossing
  for (let i = 0; i < iterations; i += 1) {
    relaxNodePositions(nodes, links, nodeMap);
  }

  // Calculate link paths
  const layoutLinks = calculateLinkPaths(links, nodes, nodeMap, nodeWidth);

  return { nodes, links: layoutLinks };
}

/**
 * Computes the depth (column) for each node
 */
function computeNodeDepths(
  nodes: SankeyLayoutNode[],
  links: SankeyLink[],
  nodeMap: Map<string | number, number>,
): void {
  // Start with nodes that have no incoming links (source nodes)
  const remainingNodes = new Set(nodes.map((_, i) => i));
  const incomingLinks = new Map<number, number>();

  // Count incoming links for each node
  links.forEach((link) => {
    const targetIndex = nodeMap.get(link.target)!;
    incomingLinks.set(targetIndex, (incomingLinks.get(targetIndex) || 0) + 1);
  });

  // Nodes with no incoming links are at depth 0
  let currentDepth = 0;
  let nextLevelNodes: number[] = [];

  // Find nodes with no incoming links
  nodes.forEach((_, i) => {
    if (!incomingLinks.has(i) || incomingLinks.get(i) === 0) {
      nodes[i].depth = currentDepth;
      remainingNodes.delete(i);
      nextLevelNodes.push(i);
    }
  });

  // Process nodes level by level
  while (nextLevelNodes.length > 0) {
    currentDepth += 1;
    const currentNodes = nextLevelNodes;
    nextLevelNodes = [];

    // Process outgoing links from the current level
    for (const nodeIndex of currentNodes) {
      // Find outgoing links
      links.forEach((link) => {
        const sourceIndex = nodeMap.get(link.source)!;
        const targetIndex = nodeMap.get(link.target)!;

        if (sourceIndex === nodeIndex) {
          // Decrease incoming links count for the target
          const incoming = incomingLinks.get(targetIndex)! - 1;
          incomingLinks.set(targetIndex, incoming);

          // If all incoming links are processed, add to the next level
          if (incoming === 0 && remainingNodes.has(targetIndex)) {
            const targetDepth = currentDepth;
            nodes[targetIndex].depth = targetDepth;
            remainingNodes.delete(targetIndex);
            nextLevelNodes.push(targetIndex);
          }
        }
      });
    }
  }

  // Handle cycles by assigning remaining nodes to the next depth
  if (remainingNodes.size > 0) {
    remainingNodes.forEach((nodeIndex) => {
      nodes[nodeIndex].depth = currentDepth;
    });
  }
}

/**
 * Computes vertical positions for nodes
 */
function computeNodeVerticalPositions(
  nodes: SankeyLayoutNode[],
  height: number,
  nodeGap: number,
): void {
  // Group nodes by depth
  const nodesByDepth = new Map<number, SankeyLayoutNode[]>();
  nodes.forEach((node) => {
    if (!nodesByDepth.has(node.depth)) {
      nodesByDepth.set(node.depth, []);
    }
    nodesByDepth.get(node.depth)!.push(node);
  });

  // For each depth, position nodes vertically
  nodesByDepth.forEach((depthNodes) => {
    // Sort nodes by value for better positioning
    depthNodes.sort((a, b) => b.value - a.value);

    const totalHeight = height - nodeGap * (depthNodes.length - 1);
    let totalValue = 0;
    depthNodes.forEach((node) => {
      totalValue += node.value;
    });

    // Position nodes proportionally to their values
    let y = 0;
    depthNodes.forEach((node, _i) => {
      const nodeHeight =
        totalValue > 0 ? (node.value / totalValue) * totalHeight : totalHeight / depthNodes.length;
      node.y0 = y;
      node.y1 = y + Math.max(nodeHeight, 1); // Ensure at least 1px height
      y = node.y1 + nodeGap;
    });
  });
}

/**
 * Computes horizontal positions for nodes
 */
function computeNodeHorizontalPositions(
  nodes: SankeyLayoutNode[],
  width: number,
  nodeWidth: number,
): void {
  // Find maximum depth
  let maxDepth = 0;
  nodes.forEach((node) => {
    maxDepth = Math.max(maxDepth, node.depth);
  });

  // Calculate horizontal position for each node
  const columnWidth = (width - nodeWidth) / Math.max(1, maxDepth);
  nodes.forEach((node) => {
    node.x0 = node.depth * columnWidth;
    node.x1 = node.x0 + nodeWidth;
  });
}

/**
 * Optimizes node positions to reduce link crossing
 */
function relaxNodePositions(
  nodes: SankeyLayoutNode[],
  links: SankeyLink[],
  nodeMap: Map<string | number, number>,
): void {
  // Group nodes by depth
  const nodesByDepth = new Map<number, SankeyLayoutNode[]>();
  nodes.forEach((node) => {
    if (!nodesByDepth.has(node.depth)) {
      nodesByDepth.set(node.depth, []);
    }
    nodesByDepth.get(node.depth)!.push(node);
  });

  // For each depth > 0, optimize positions
  for (let depth = 1; depth <= Math.max(...Array.from(nodesByDepth.keys())); depth += 1) {
    const depthNodes = nodesByDepth.get(depth);
    if (!depthNodes || depthNodes.length <= 1) {
      continue;
    }

    // For each node, calculate the center of its incoming links
    depthNodes.forEach((node) => {
      let centerY = 0;
      let totalWeight = 0;

      // Find incoming links for this node
      links.forEach((link) => {
        if (link.target === node.id) {
          const sourceIndex = nodeMap.get(link.source)!;
          const sourceNode = nodes[sourceIndex];

          // Calculate weighted center based on link value
          const sourceY = (sourceNode.y0 + sourceNode.y1) / 2;
          centerY += sourceY * link.value;
          totalWeight += link.value;
        }
      });

      // Calculate weighted center
      if (totalWeight > 0) {
        node.targetY = centerY / totalWeight;
      }
    });

    // Sort nodes by target Y position
    depthNodes.sort((a, b) => (a.targetY || 0) - (b.targetY || 0));

    // Redistribute nodes with equal spacing
    const nodeGap = (depthNodes[depthNodes.length - 1].y1 - depthNodes[0].y0) / depthNodes.length;

    depthNodes.forEach((node, i) => {
      const nodeHeight = node.y1 - node.y0;
      node.y0 = depthNodes[0].y0 + i * nodeGap;
      node.y1 = node.y0 + nodeHeight;
    });
  }
}

/**
 * Calculates paths for links between nodes
 */
function calculateLinkPaths(
  links: SankeyLink[],
  nodes: SankeyLayoutNode[],
  nodeMap: Map<string | number, number>,
  _nodeWidth: number,
): SankeyLayoutLink[] {
  return links.map((link) => {
    const sourceIndex = nodeMap.get(link.source)!;
    const targetIndex = nodeMap.get(link.target)!;
    const sourceNode = nodes[sourceIndex];
    const targetNode = nodes[targetIndex];

    // Calculate link width proportional to its value
    const linkWidth = Math.max(1, link.value);

    // Calculate vertical position in the source node
    const sy0 = sourceNode.y0;
    const sy1 = sourceNode.y1;

    // Calculate vertical position in the target node
    const ty0 = targetNode.y0;
    const ty1 = targetNode.y1;

    // Calculate link path as a bezier curve
    const curvature = 0.5;
    const x0 = sourceNode.x1;
    const x1 = targetNode.x0;
    const xi = (x0 + x1) * curvature;

    // Calculate proportional position based on the node's links
    const sourceProportion = calculateLinkProportion(link, links, sourceNode, 'source');
    const targetProportion = calculateLinkProportion(link, links, targetNode, 'target');

    const y0 = sy0 + (sy1 - sy0) * sourceProportion;
    const y1 = ty0 + (ty1 - ty0) * targetProportion;

    // Create SVG path
    const path = `
      M ${x0},${y0}
      C ${xi},${y0} ${xi},${y1} ${x1},${y1}
    `;

    return {
      ...link,
      width: linkWidth,
      sourceNode,
      targetNode,
      path: path.trim(),
    };
  });
}

/**
 * Calculates the proportional position of a link within its node
 */
function calculateLinkProportion(
  link: SankeyLink,
  allLinks: SankeyLink[],
  node: SankeyLayoutNode,
  direction: 'source' | 'target',
): number {
  // Find all links connected to this node in the specified direction
  const connectedLinks = allLinks.filter((l) =>
    direction === 'source' ? l.source === node.id : l.target === node.id,
  );

  // Sort links by value
  connectedLinks.sort((a, b) => a.value - b.value);

  // Find the position of the current link
  const linkIndex = connectedLinks.findIndex(
    (l) => l.source === link.source && l.target === link.target,
  );

  // Calculate total value of all connected links
  const totalValue = connectedLinks.reduce((sum, l) => sum + l.value, 0);

  // Calculate the proportion based on the values of links before this one
  const valueBeforeThisLink = connectedLinks
    .slice(0, linkIndex)
    .reduce((sum, l) => sum + l.value, 0);

  // Return the center point of this link's span
  return (valueBeforeThisLink + link.value / 2) / totalValue;
}
