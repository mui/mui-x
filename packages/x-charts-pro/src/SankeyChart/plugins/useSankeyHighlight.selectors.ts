import { createSelector } from '@mui/x-charts/internals';
import type { UseSankeyHighlightSignature } from './useSankeyHighlight.types';
import type {
  SankeyItemIdentifier,
  SankeyNodeOptions,
  SankeyLinkOptions,
  SankeyLayoutLink,
} from '../sankey.types';

const selectorChartsHighlight = (state: UseSankeyHighlightSignature['state']) => state.highlight;

/**
 * Get the currently highlighted item in the Sankey chart.
 * @param {UseSankeyHighlightSignature['state']} state The state of the chart.
 * @returns {SankeyItemIdentifier | null} The highlighted item identifier or null.
 */
export const selectorSankeyHighlightedItem = createSelector(
  [selectorChartsHighlight],
  (highlight) => highlight.item,
);

/**
 * Determines if a specific node should be highlighted.
 * A node is highlighted if:
 * - It's the hovered node (unless highlight mode is 'none')
 * - It's connected to a hovered link (based on linkOptions.highlight)
 */
export const createSelectorIsNodeHighlighted = (
  nodeId: string | number,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) =>
  createSelector([selectorSankeyHighlightedItem], (highlightedItem): boolean => {
    if (!highlightedItem) {
      return false;
    }

    if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
      return nodeOptions?.highlight !== 'none';
    }

    if (highlightedItem.subType === 'link') {
      if (
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

    return false;
  });

/**
 * Creates a selector that determines if a specific link should be highlighted.
 * A link is highlighted if:
 * - It's the hovered link (unless highlight mode is 'none')
 * - It's connected to a hovered node (based on nodeOptions.highlight)
 */
export const createSelectorIsLinkHighlighted = (
  link: SankeyLayoutLink,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) =>
  createSelector([selectorSankeyHighlightedItem], (highlightedItem): boolean => {
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
      if (
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

    return false;
  });

/**
 * Creates a selector that determines if an item should be faded.
 * An item is faded if:
 * - There's a highlighted item
 * - This item is not highlighted
 * - The fade mode is 'global' for the hovered element type
 */
export const createSelectorIsFaded = (
  isHighlighted: boolean,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) =>
  createSelector([selectorSankeyHighlightedItem], (highlightedItem): boolean => {
    if (!highlightedItem || isHighlighted) {
      return false;
    }

    const fadeMode = highlightedItem.subType === 'node' ? nodeOptions?.fade : linkOptions?.fade;

    return fadeMode === 'global';
  });

/**
 * Creates a callback function that determines if a node should be highlighted.
 * This is useful when you need to check many nodes without creating multiple selectors.
 */
export const createIsNodeHighlightedCallback = (
  highlightedItem: SankeyItemIdentifier | null,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) => {
  return (nodeId: string | number): boolean => {
    if (!highlightedItem) {
      return false;
    }

    if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
      return nodeOptions?.highlight !== 'none';
    }

    if (highlightedItem.subType === 'link') {
      if (
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

    return false;
  };
};

/**
 * Creates a callback function that determines if a link should be highlighted.
 * This is useful when you need to check many links without creating multiple selectors.
 */
export const createIsLinkHighlightedCallback = (
  highlightedItem: SankeyItemIdentifier | null,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) => {
  return (link: SankeyLayoutLink): boolean => {
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
      if (
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

    return false;
  };
};

/**
 * Creates a callback function that determines if an item should be faded.
 */
export const createIsFadedCallback = (
  highlightedItem: SankeyItemIdentifier | null,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) => {
  return (isHighlighted: boolean): boolean => {
    if (!highlightedItem || isHighlighted) {
      return false;
    }

    const fadeMode = highlightedItem.subType === 'node' ? nodeOptions?.fade : linkOptions?.fade;

    return fadeMode === 'global';
  };
};

/**
 * Creates a selector that returns both highlighted and faded state for a specific node.
 * This avoids the need for dependent selectors.
 */
export const createSelectorNodeHighlightState = (
  nodeId: string | number,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) =>
  createSelector(
    [selectorSankeyHighlightedItem],
    (highlightedItem): { highlighted: boolean; faded: boolean } => {
      if (!highlightedItem) {
        return { highlighted: false, faded: false };
      }

      let highlighted = false;
      if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
        highlighted = nodeOptions?.highlight !== 'none';
      } else if (highlightedItem.subType === 'link') {
        if (
          linkOptions?.highlight &&
          linkOptions.highlight !== 'none' &&
          linkOptions.highlight !== 'links'
        ) {
          const { sourceId, targetId } = highlightedItem;
          switch (linkOptions.highlight) {
            case 'nodes':
              highlighted = nodeId === sourceId || nodeId === targetId;
              break;
            case 'source':
              highlighted = nodeId === sourceId;
              break;
            case 'target':
              highlighted = nodeId === targetId;
              break;
            default:
              break;
          }
        }
      }

      const faded =
        !highlighted &&
        (highlightedItem.subType === 'node' ? nodeOptions?.fade : linkOptions?.fade) === 'global';

      return { highlighted, faded };
    },
  );

/**
 * Creates a selector that returns both highlighted and faded state for a specific link.
 * This avoids the need for dependent selectors.
 */
export const createSelectorLinkHighlightState = (
  link: SankeyLayoutLink,
  nodeOptions: SankeyNodeOptions | undefined,
  linkOptions: SankeyLinkOptions | undefined,
) =>
  createSelector(
    [selectorSankeyHighlightedItem],
    (highlightedItem): { highlighted: boolean; faded: boolean } => {
      if (!highlightedItem) {
        return { highlighted: false, faded: false };
      }

      let highlighted = false;
      if (
        highlightedItem.subType === 'link' &&
        highlightedItem.sourceId === link.source.id &&
        highlightedItem.targetId === link.target.id
      ) {
        highlighted = linkOptions?.highlight !== 'none';
      } else if (highlightedItem.subType === 'node') {
        if (
          nodeOptions?.highlight &&
          nodeOptions.highlight !== 'none' &&
          nodeOptions.highlight !== 'nodes'
        ) {
          const hoveredNodeId = highlightedItem.nodeId;
          switch (nodeOptions.highlight) {
            case 'links':
              highlighted = link.source.id === hoveredNodeId || link.target.id === hoveredNodeId;
              break;
            case 'incoming':
              highlighted = link.target.id === hoveredNodeId;
              break;
            case 'outgoing':
              highlighted = link.source.id === hoveredNodeId;
              break;
            default:
              break;
          }
        }
      }

      const faded =
        !highlighted &&
        (highlightedItem.subType === 'node' ? nodeOptions?.fade : linkOptions?.fade) === 'global';

      return { highlighted, faded };
    },
  );
