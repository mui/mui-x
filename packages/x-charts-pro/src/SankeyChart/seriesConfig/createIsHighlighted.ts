import type { ChartSeriesType } from '@mui/x-charts/internals';
import type { HighlightItemIdentifierWithType } from '@mui/x-charts/models';
import type {
  SankeyHighlightScope,
  SankeyLinkHighlight,
  SankeyNodeHighlight,
} from '../sankey.highlight.types';

const DEFAULT_NODE_HIGHLIGHT = 'links';
const DEFAULT_LINK_HIGHLIGHT = 'links';

function alwaysFalse(): boolean {
  return false;
}

function isNodeHighlighted(
  highlightedItem: HighlightItemIdentifierWithType<'sankey'>,
  nodeHighlight: SankeyNodeHighlight,
  linkHighlight: SankeyLinkHighlight,
  item: HighlightItemIdentifierWithType<'sankey'>,
): boolean {
  if (item.subType !== 'node') {
    return false;
  }

  const nodeId = item.nodeId;

  if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
    return nodeHighlight !== 'none';
  }

  if (highlightedItem.subType === 'link') {
    if (!linkHighlight || linkHighlight === 'none' || linkHighlight === 'links') {
      return false;
    }

    const { sourceId, targetId } = highlightedItem;

    switch (linkHighlight) {
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

  return false;
}

function isLinkHighlighted(
  highlightedItem: HighlightItemIdentifierWithType<'sankey'>,
  nodeHighlight: SankeyNodeHighlight,
  linkHighlight: SankeyLinkHighlight,
  item: HighlightItemIdentifierWithType<'sankey'>,
): boolean {
  if (item.subType !== 'link') {
    return false;
  }

  const { sourceId, targetId } = item;

  if (
    highlightedItem.subType === 'link' &&
    highlightedItem.sourceId === sourceId &&
    highlightedItem.targetId === targetId
  ) {
    return linkHighlight !== 'none';
  }

  if (highlightedItem.subType === 'node') {
    if (!nodeHighlight || nodeHighlight === 'none' || nodeHighlight === 'nodes') {
      return false;
    }

    const highlightedNodeId = highlightedItem.nodeId;

    switch (nodeHighlight) {
      case 'links':
        return sourceId === highlightedNodeId || targetId === highlightedNodeId;
      case 'incoming':
        return targetId === highlightedNodeId;
      case 'outgoing':
        return sourceId === highlightedNodeId;
      default:
        return false;
    }
  }

  return false;
}

export function createSankeyIsHighlighted(
  highlightScope: SankeyHighlightScope | null | undefined,
  highlightedItem: HighlightItemIdentifierWithType<'sankey'> | null,
) {
  if (!highlightedItem) {
    return alwaysFalse;
  }

  const nodeHighlight = highlightScope?.nodes?.highlight ?? DEFAULT_NODE_HIGHLIGHT;
  const linkHighlight = highlightScope?.links?.highlight ?? DEFAULT_LINK_HIGHLIGHT;

  return function isHighlighted(
    item: HighlightItemIdentifierWithType<ChartSeriesType> | null,
  ): boolean {
    if (!item || item.type !== 'sankey') {
      return false;
    }

    const sankeyItem = item as HighlightItemIdentifierWithType<'sankey'>;

    if (sankeyItem.subType === 'node') {
      return isNodeHighlighted(highlightedItem, nodeHighlight, linkHighlight, sankeyItem);
    }

    if (sankeyItem.subType === 'link') {
      return isLinkHighlighted(highlightedItem, nodeHighlight, linkHighlight, sankeyItem);
    }

    return false;
  };
}
