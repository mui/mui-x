'use client';
import { warnOnce } from '@mui/x-internals/warning';
import type { SankeyLink, NodeId, SankeyNode } from './sankey.types';

/**
 * Finds circular references in a Sankey diagram using DFS
 *
 * @param data The Sankey data (nodes and links)
 * @returns Array of links that create circular references
 */
export function findCycles(
  links: readonly SankeyLink[],
  nodes?: readonly SankeyNode[],
): SankeyLink[] {
  const visited: Set<NodeId> = new Set();
  const stack: Set<NodeId> = new Set();
  const circularLinks: SankeyLink[] = [];

  function dfs(nodeId: NodeId): boolean {
    if (stack.has(nodeId)) {
      // Found a cycle
      return true;
    }
    if (visited.has(nodeId)) {
      // Already visited this node, no cycle here
      return false;
    }

    visited.add(nodeId);
    stack.add(nodeId);

    const linksFromNode = links.filter((link) => link.source === nodeId);
    for (const link of linksFromNode) {
      if (dfs(link.target)) {
        circularLinks.push(link);
        warnOnce(
          `MUI X Charts: Sankey diagram contains circular references. The link ${Array.from(stack).join(' -> ')} is cyclic.`,
        );
        return true; // Cycle found, no need to continue
      }
    }

    stack.delete(nodeId);
    return false;
  }

  nodes?.forEach((node) => {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  });

  return circularLinks;
}
