'use client';

import type { CommonDefaultizedProps, SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';

export type NodeId = string | number;

export interface SankeyNode {
  /**
   * Unique identifier for the node
   */
  id: NodeId;

  /**
   * The node label to display
   */
  label?: string;

  /**
   * Optional custom data for the node
   */
  data?: any;

  /**
   * Optional color override for the node
   */
  color?: string;
}

export interface SankeyLink {
  /**
   * Source node ID
   */
  source: NodeId;

  /**
   * Target node ID
   */
  target: NodeId;

  /**
   * The value/weight of the link (affects width)
   */
  value: number;

  /**
   * Optional custom data for the link
   */
  data?: any;

  /**
   * Optional color override for the link
   */
  color?: string;
}

export interface SankeyValueType {
  /**
   * Array of nodes in the Sankey diagram
   */
  nodes: readonly SankeyNode[];

  /**
   * Array of links between nodes
   */
  links: readonly SankeyLink[];
}

export interface SankeySeriesType {
  /**
   * Unique identifier for the series
   */
  id?: SeriesId;

  /**
   * Type identifier for Sankey series
   */
  type: 'sankey';

  /**
   * The data for the Sankey diagram
   */
  data: SankeyValueType;

  /**
   * Optional color for nodes without specified colors
   */
  nodeColor?: string;

  /**
   * Optional color for links without specified colors
   */
  linkColor?: string;

  /**
   * Opacity for the links (0-1)
   */
  linkOpacity?: number;

  /**
   * Gap between nodes
   */
  nodeGap?: number;

  /**
   * Width of nodes
   */
  nodeWidth?: number;

  /**
   * Whether to show node labels
   */
  showNodeLabels?: boolean;

  /**
   * Whether to show link values
   */
  showLinkValues?: boolean;

  /**
   * Number of iterations for the layout algorithm
   */
  iterations?: number;

  /**
   * Layout direction of the Sankey diagram
   */
  layout?: 'horizontal' | 'vertical';
}

/**
 * Represents the calculated positions and dimensions for a node in the Sankey diagram
 */
export interface SankeyLayoutNode extends SankeyNode {
  // Calculated positions and dimensions
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  value: number;
  depth: number;
  height?: number;
  targetY?: number; // Used during layout calculation
}

/**
 * Represents the calculated positions and paths for a link in the Sankey diagram
 */
export interface SankeyLayoutLink extends SankeyLink {
  // Calculated positions and paths
  width: number;
  sourceNode: SankeyLayoutNode;
  targetNode: SankeyLayoutNode;
  path: string; // SVG path definition
}

/**
 * Calculated layout for the Sankey diagram
 */
export interface SankeyLayout {
  nodes: readonly SankeyLayoutNode[];
  links: readonly SankeyLayoutLink[];
}

export interface DefaultizedSankeySeriesType
  extends DefaultizedProps<SankeySeriesType, Exclude<CommonDefaultizedProps, 'valueFormatter'>> {}

// Define SankeyItemIdentifier type
export interface SankeyItemIdentifier {
  type: 'sankey';
  /**
   * Unique identifier for the series
   */
  seriesId: SeriesId;
  /**
   * Subtype to differentiate between node and link
   */
  subType: 'node' | 'link';
  /**
   * Unique identifier for the node or link.
   * If subType is 'node', this is the node ID.
   * If subType is 'link', this is a `{$sourceId}-${targetId}` string.
   */
  id: NodeId;
}
