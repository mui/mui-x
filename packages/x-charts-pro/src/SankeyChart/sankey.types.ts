'use client';

import type { CommonDefaultizedProps, SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';
import type {
  SankeyLink as D3SankeyLink,
  SankeyNode as D3SankeyNode,
} from '@mui/x-charts-vendor/d3-sankey';

export type NodeId = string | number;

export interface SankeyNodeConfig {
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

export interface SankeyNode extends SankeyNodeConfig {
  /**
   * Unique identifier for the node
   */
  id: NodeId;
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

export type SankeyNodeConfigs = Record<NodeId, SankeyNodeConfig>;

export interface SankeyValueType {
  /**
   * Map of node configs for the Sankey diagram
   *
   * This is optional, but can be used to provide custom labels or styles for nodes.
   */
  nodes?: SankeyNodeConfigs;

  /**
   * Array of links between nodes.
   *
   * The node ids will be used as the labels. If you want to provide custom labels, use the `nodes` property.
   *
   * Each link should have a `source`, `target`, and `value` property.
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
  nodePadding?: number;

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

  /**
   * Node alignment strategy
   *
   * - 'justify': Nodes are evenly distributed across the width.
   * - 'left': Nodes are aligned to the left.
   * - 'right': Nodes are aligned to the right.
   * - 'center': Nodes are centered.
   *
   * @default 'justify'
   */
  nodeAlign?: 'justify' | 'left' | 'right' | 'center';

  /**
   * Custom sort function for nodes
   * @param {SankeyLayoutNode} a - First node to compare
   * @param {SankeyLayoutNode} b - Second node to compare
   * @returns {number} Comparison result
   */
  nodeSort?: (a: SankeyLayoutNode, b: SankeyLayoutNode) => number | null;

  /**
   * Custom sort function for links
   * @param {SankeyLayoutLink} a - First link to compare
   * @param {SankeyLayoutLink} b - Second link to compare
   * @returns {number} Comparison result
   */
  linkSort?: (
    a: D3SankeyLink<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>,
    b: D3SankeyLink<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>,
  ) => number | null;
}

/**
 * Represents the calculated positions and dimensions for a node in the Sankey diagram
 */
export interface SankeyLayoutNode
  extends D3SankeyNode<SankeyNode, Omit<SankeyLink, 'source' | 'target'>> {}

/**
 * Represents the calculated positions and paths for a link in the Sankey diagram
 */
export interface SankeyLayoutLink
  extends D3SankeyLink<SankeyNode, Omit<SankeyLink, 'source' | 'target'>> {
  path: string | null;
  source: SankeyLayoutNode;
  target: SankeyLayoutNode;
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
