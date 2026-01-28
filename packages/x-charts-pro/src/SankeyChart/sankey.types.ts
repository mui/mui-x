'use client';

import type { HighlightScope, SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import type { SankeyLink as D3SankeyLink, SankeyNode as D3SankeyNode } from './d3Sankey';
import type { SankeyLinkHighlightScope, SankeyNodeHighlightScope } from './sankey.highlight.types';

export type SankeyNodeId = string | number;

export interface SankeyNode {
  /**
   * Unique identifier for the node
   */
  id: SankeyNodeId;

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
  source: SankeyNodeId;

  /**
   * Target node ID
   */
  target: SankeyNodeId;

  /**
   * The value/weight of the link (affects width)
   */
  value: number;

  /**
   * Optional custom data for the link
   */
  data?: any;

  /**
   * Optional color override for the link.
   * Can be a color string, or a keyword:
   * - 'source': Use the color of the source node
   * - 'target': Use the color of the target node
   * @default 'source'
   */
  color?: string | 'source' | 'target';
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
   * Custom sort mode for nodes
   *
   * - 'auto': Automatic sorting behavior (default)
   * - 'fixed': Preserve the order from the nodes array (disables automatic sorting)
   * - or a custom function
   *
   * @param {SankeyLayoutNode} a - First node to compare
   * @param {SankeyLayoutNode} b - Second node to compare
   * @returns {number} Comparison result
   *
   * @default 'auto'
   */
  sort?: 'auto' | 'fixed' | ((a: SankeyLayoutNode<true>, b: SankeyLayoutNode<true>) => number);
} & SankeyNodeHighlightScope;

export type SankeyLinkOptions = {
  /**
   * Default color for links without specified colors.
   * Can be a color string, or a keyword:
   * - 'source': Use the color of the source node
   * - 'target': Use the color of the target node
   * @default 'source'
   */
  color?: string | 'source' | 'target';
  /**
   * Opacity of the links (0-1)
   */
  opacity?: number;
  /**
   * Whether to show link values
   */
  showValues?: boolean;
  /**
   * Custom sort mode for links
   * 
   * - 'auto': Automatic sorting behavior (default)
   * - 'fixed': Preserve the order from the links array (disables automatic sorting)
   * - or a custom function
   * 
   * @param {SankeyLayoutLink} a - First link to compare
   * @param {SankeyLayoutLink} b - Second link to compare
   * @returns {number} Comparison result

  * @default 'auto'
   */
  sort?: 'auto' | 'fixed' | ((a: SankeyLayoutLink<true>, b: SankeyLayoutLink<true>) => number);
  /**
   * Applies the given number to the X dimension of the control points of the link's curve function.
   * This can create better looking links between nodes, but is dependent on the graph layout.
   * It is specially impacted by the chart height.
   * @default 10
   */
  curveCorrection?: number;
} & SankeyLinkHighlightScope;

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
   * @default 6
   */
  iterations?: number;

  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {number} value The value to render.
   * @param {SankeyValueFormatterContext} context The rendering context of the value.
   * @param {'node' | 'link'} context.type The type of element being formatted.
   * @param {SankeyNodeId} [context.nodeId] For nodes: the node ID. For links: undefined.
   * @param {SankeyNodeId} [context.sourceId] For links: the source node ID. For nodes: undefined.
   * @param {SankeyNodeId} [context.targetId] For links: the target node ID. For nodes: undefined.
   * @returns {string | null} The formatted value to display.
   */
  valueFormatter?: (value: number, context: SankeyValueFormatterContext) => string | null;
}

// ----------------------------------------------------------------------------------------
// Those interfaces are here to allow circular dependencies between nodes and links.

export interface SankeyLayoutNodeWithoutPosition extends D3SankeyNode<
  false,
  MakeRequired<SankeyNode, 'label' | 'color'>,
  SankeyLayoutLinkWithoutPosition
> {
  targetLinks: SankeyLayoutLinkWithoutPosition[];
  sourceLinks: SankeyLayoutLinkWithoutPosition[];
  value: number;
}
export interface SankeyLayoutLinkWithoutPosition extends D3SankeyLink<
  false,
  SankeyLayoutNodeWithoutPosition,
  Omit<MakeRequired<SankeyLink, 'color'>, 'source' | 'target'>
> {
  source: SankeyLayoutNodeWithoutPosition;
  target: SankeyLayoutNodeWithoutPosition;
}
export interface SankeyLayoutNodeWithPosition extends D3SankeyNode<
  true,
  MakeRequired<SankeyNode, 'label' | 'color'>,
  SankeyLayoutLinkWithPosition
> {
  targetLinks: SankeyLayoutLinkWithPosition[];
  sourceLinks: SankeyLayoutLinkWithPosition[];
  value: number;
}
export interface SankeyLayoutLinkWithPosition extends D3SankeyLink<
  true,
  SankeyLayoutNodeWithPosition,
  Omit<MakeRequired<SankeyLink, 'color'>, 'source' | 'target'>
> {
  path?: string | null;
  source: SankeyLayoutNodeWithPosition;
  target: SankeyLayoutNodeWithPosition;
}

// ------------------------------------------

/**
 * Represents the calculated positions and dimensions for a node in the Sankey diagram
 */
export type SankeyLayoutNode<WithPosition extends boolean = true> = WithPosition extends true
  ? SankeyLayoutNodeWithPosition
  : SankeyLayoutNodeWithoutPosition;
/**
 * Represents the calculated positions and paths for a link in the Sankey diagram
 */
export type SankeyLayoutLink<WithPosition extends boolean = true> = WithPosition extends true
  ? SankeyLayoutLinkWithPosition
  : SankeyLayoutLinkWithoutPosition;

/**
 * Calculated layout for the Sankey diagram
 */
export interface SankeyLayout<WithPosition extends boolean = true> {
  nodes: readonly SankeyLayoutNode<WithPosition>[];
  links: readonly SankeyLayoutLink<WithPosition>[];
}

export interface DefaultizedSankeySeriesType extends DefaultizedProps<
  Omit<SankeySeriesType, 'data'>,
  'id' | 'valueFormatter'
> {
  // data: {
  //   nodes: Map<SankeyNodeId, SankeyNode>;
  //   links: readonly SankeyLink[];
  // };
  data: SankeyLayout<false>;
  // TODO: Implement, currently here so types don't break.
  highlightScope?: HighlightScope;
}

type SankeyNodeIdentifierBase = {
  type: 'sankey';
  /**
   * Unique identifier for the series
   */
  seriesId: SeriesId;
};

export type SankeyNodeIdentifier = SankeyNodeIdentifierBase & {
  /**
   * Subtype to differentiate between node and link
   */
  subType: 'node';
  /**
   * The id of the node
   */
  nodeId: SankeyNodeId;
};

export type SankeyNodeIdentifierWithData<WithPosition extends boolean = true> =
  SankeyNodeIdentifier & {
    /**
     * The node object with all the calculated properties
     */
    node: SankeyLayoutNode<WithPosition>;
  };

export type SankeyLinkIdentifier = SankeyNodeIdentifierBase & {
  /**
   * Subtype to differentiate between node and link
   */
  subType: 'link';
  /**
   * The id of the source node
   */
  sourceId: SankeyNodeId;
  /**
   * The id of the target node
   */
  targetId: SankeyNodeId;
};

export type SankeyLinkIdentifierWithData<WithPosition extends boolean = true> =
  SankeyLinkIdentifier & {
    /**
     * The link object with all the calculated properties
     */
    link: SankeyLayoutLink<WithPosition>;
  };

export type SankeyItemIdentifier = SankeyNodeIdentifier | SankeyLinkIdentifier;

export type SankeyItemIdentifierWithData<WithPosition extends boolean = true> =
  | SankeyNodeIdentifierWithData<WithPosition>
  | SankeyLinkIdentifierWithData<WithPosition>;

export type SankeyValueFormatterContext =
  | {
      /**
       * Where the value will be displayed
       */
      location: 'tooltip' | 'label';
      /**
       * Can be 'node' or 'link'
       */
      type: 'node';
      /**
       * The id of the node
       */
      nodeId: SankeyNodeId;
    }
  | {
      /**
       * Where the value will be displayed
       */
      location: 'tooltip' | 'label';
      /**
       * Can be 'node' or 'link'
       */
      type: 'link';
      /**
       * The id of the source node
       */
      sourceId: SankeyNodeId;
      /**
       * The id of the target node
       */
      targetId: SankeyNodeId;
    };
