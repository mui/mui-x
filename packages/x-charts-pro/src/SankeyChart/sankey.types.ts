'use client';

import type { CommonDefaultizedProps, SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';
import type {
  SankeyLink as D3SankeyLink,
  SankeyNode as D3SankeyNode,
} from '@mui/x-charts-vendor/d3-sankey';

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

export type SankeyNodeOptions = {
  /**
   * Default color for nodes without specified colors
   */
  color?: string;
  /**
   * Width of the nodes in pixels
   */
  width?: number;
  /**
   * Padding between nodes in pixels
   */
  padding?: number;
  /**
   * Node alignment strategy
   * - 'justify': Nodes are evenly distributed across the width.
   * - 'left': Nodes are  aligned to the left.
   * - 'right': Nodes are aligned to the right.
   * - 'center': Nodes are centered.
   * @default 'justify'
   */
  align?: 'justify' | 'left' | 'right' | 'center';
  /**
   * Whether to show node labels
   */
  showLabels?: boolean;
  /**
   * Custom sort function for nodes
   * @param {SankeyLayoutNode} a - First node to compare
   * @param {SankeyLayoutNode} b - Second node to compare
   * @returns {number} Comparison result
   */
  sort?: (a: SankeyLayoutNode, b: SankeyLayoutNode) => number | null;
};

export type SankeyLinkOptions = {
  /**
   * Default color for links without specified colors
   */
  color?: string;
  /**
   * Opacity of the links (0-1)
   */
  opacity?: number;
  /**
   * Whether to show link values
   */
  showValues?: boolean;
  /**
   * Custom sort function for links
   * @param {SankeyLayoutLink} a - First link to compare
   * @param {SankeyLayoutLink} b - Second link to compare
   * @returns {number} Comparison result
   */
  sort?: (a: SankeyLayoutLink, b: SankeyLayoutLink) => number | null;
};

export interface SankeyData {
  /**
   * An array of node configs for the Sankey diagram
   *
   * This is optional, but can be used to provide custom labels or styles for nodes.
   */
  nodes?: readonly SankeyNode[];

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
  data: SankeyData;

  /**
   * Optional configuration for the nodes style, layout, and behavior
   */
  nodeOptions?: SankeyNodeOptions;

  /**
   * Optional configuration for the links style, layout, and behavior
   */
  linkOptions?: SankeyLinkOptions;

  /**
   * Number of iterations for the layout algorithm
   */
  iterations?: number;
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
  path?: string | null;
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
export type SankeyItemIdentifier = {
  type: 'sankey';
  /**
   * Unique identifier for the series
   */
  seriesId: SeriesId;
} & (
  | {
      /**
       * Subtype to differentiate between node and link
       */
      subType: 'node';
      /**
       * The node object with all the calculated properties
       */
      node: SankeyLayoutNode;
    }
  | {
      /**
       * Subtype to differentiate between node and link
       */
      subType: 'link';
      /**
       * The link object with all the calculated properties
       */
      link: SankeyLayoutLink;
    }
);
