import {
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from '@mui/x-charts-vendor/d3-sankey';
import type {
  SankeyNodeOptions,
  SankeyLinkOptions,
  SankeyItemIdentifier,
  SankeyLayoutLink,
} from './sankey.types';

export const getNodeAlignFunction = (align: SankeyNodeOptions['align']) => {
  switch (align) {
    case 'left':
      return sankeyLeft;
    case 'right':
      return sankeyRight;
    case 'center':
      return sankeyCenter;
    case 'justify':
    default:
      return sankeyJustify;
  }
};

/**
 * Determines if a node should be highlighted based on the highlighted item and node options.
 */
export function isNodeHighlighted(
  highlightedItem: SankeyItemIdentifier | null,
  nodeId: string | number,
  nodeOptions: SankeyNodeOptions | undefined,
): boolean {
  if (!highlightedItem) {
    return false;
  }

  if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
    return nodeOptions?.highlight !== 'none';
  }

  if (highlightedItem.subType === 'link') {
    return false;
  }

  return false;
}

/**
 * Determines if a link should be highlighted when hovering over a node.
 */
export function isLinkHighlightedByNode(
  highlightedItem: SankeyItemIdentifier | null,
  link: SankeyLayoutLink,
  nodeOptions: SankeyNodeOptions | undefined,
): boolean {
  if (
    !highlightedItem ||
    highlightedItem.subType !== 'node' ||
    !nodeOptions?.highlight ||
    nodeOptions.highlight === 'none' ||
    nodeOptions.highlight === 'nodes'
  ) {
    return false;
  }

  const hoveredNodeId = highlightedItem.nodeId;

  switch (nodeOptions.highlight) {
    case 'links':
      return link.source.id === hoveredNodeId || link.target.id === hoveredNodeId;
    case 'incoming':
      return link.target.id === hoveredNodeId;
    case 'outgoing':
      return link.source.id === hoveredNodeId;
    default:
      return false;
  }
}

/**
 * Determines if a link should be highlighted based on the highlighted item and link options.
 */
export function isLinkHighlighted(
  highlightedItem: SankeyItemIdentifier | null,
  link: SankeyLayoutLink,
  linkOptions: SankeyLinkOptions | undefined,
): boolean {
  if (!highlightedItem) {
    return false;
  }

  if (
    highlightedItem.subType === 'link' &&
    highlightedItem.sourceId === link.source.id &&
    highlightedItem.targetId === link.target.id
  ) {
    return linkOptions?.highlight !== 'none';
  }

  if (highlightedItem.subType === 'node') {
    return false;
  }

  return false;
}

/**
 * Determines if a node should be highlighted when hovering over a link.
 */
export function isNodeHighlightedByLink(
  highlightedItem: SankeyItemIdentifier | null,
  nodeId: string | number,
  linkOptions: SankeyLinkOptions | undefined,
): boolean {
  if (
    !highlightedItem ||
    highlightedItem.subType !== 'link' ||
    !linkOptions?.highlight ||
    linkOptions.highlight === 'none' ||
    linkOptions.highlight === 'links'
  ) {
    return false;
  }

  const { sourceId, targetId } = highlightedItem;

  switch (linkOptions.highlight) {
    case 'nodes':
      return nodeId === sourceId || nodeId === targetId;
    case 'source':
      return nodeId === sourceId;
    case 'target':
      return nodeId === targetId;
    default:
      return false;
  }
}

/**
 * Determines if an item should be faded based on highlighting configuration.
 * The fade mode is determined by which type of element is being hovered.
 */
export function shouldFadeItem(
  highlightedItem: SankeyItemIdentifier | null,
  isHighlighted: boolean,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
): boolean {
  if (!highlightedItem || isHighlighted) {
    return false;
  }

  if (isHighlighted) {
    return false;
  }

  // Determine which fade mode to use based on the hovered element type
  const fadeMode = highlightedItem.subType === 'node' ? nodeOptions?.fade : linkOptions?.fade;

  // Fade based on the mode
  return fadeMode === 'global';
}
