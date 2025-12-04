import { min } from '@mui/x-charts-vendor/d3-array';
import type { SankeyLink, SankeyNode, SankeyNodeMinimal } from './sankey.types';

function targetDepth(d: SankeyLink<{}, {}>): number {
  return (d.target as SankeyNodeMinimal<{}, {}>).depth ?? 0;
}

/**
 * Compute the horizontal node position of a node in a Sankey layout with left alignment.
 * Returns (node.depth) to indicate the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 */
export function sankeyLeft(node: SankeyNode<{}, {}>): number {
  return node.depth ?? 0;
}

/**
 * Compute the horizontal node position of a node in a Sankey layout with right alignment.
 * Returns (n - 1 - node.height) to indicate the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 * @param n Total depth n of the graph  (one plus the maximum node.depth)
 */
export function sankeyRight(node: SankeyNode<{}, {}>, n: number): number {
  return n - 1 - (node.height ?? 0);
}

/**
 * Compute the horizontal node position of a node in a Sankey layout with justified alignment.
 * Like d3.sankeyLeft, except that nodes without any outgoing links are moved to the far right.
 * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 * @param n Total depth n of the graph  (one plus the maximum node.depth)
 */
export function sankeyJustify(node: SankeyNode<{}, {}>, n: number): number {
  return node.sourceLinks?.length ? (node.depth ?? 0) : n - 1;
}

/**
 * Compute the horizontal node position of a node in a Sankey layout with center alignment.
 * Like d3.sankeyLeft, except that nodes without any incoming links are moved as right as possible.
 * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 */
export function sankeyCenter(node: SankeyNode<{}, {}>): number {
  if (node.targetLinks?.length) {
    return node.depth ?? 0;
  }
  if (node.sourceLinks?.length) {
    return (min(node.sourceLinks, targetDepth) ?? 0) - 1;
  }
  return 0;
}
