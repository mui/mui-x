import { createSelector } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '@mui/x-charts/internals';
import type { UseSankeyHighlightSignature } from './useSankeyHighlight.types';
import type { SankeyLayoutLink, SankeyNodeId } from '../sankey.types';
import type {
  SankeyLinkFade,
  SankeyLinkHighlight,
  SankeyNodeFade,
  SankeyNodeHighlight,
} from '../sankey.highlight.types';

const selectorSankeyHighlight = (state: UseSankeyHighlightSignature['state']) => state.highlight;

const selectorSankeySeries = createSelector(
  selectorChartSeriesProcessed,
  (processedSeries) =>
    processedSeries.sankey?.series[processedSeries.sankey?.seriesOrder[0]] || null,
);

const DEFAULT_NODE_HIGHLIGHT: SankeyNodeHighlight = 'links';
const DEFAULT_LINK_HIGHLIGHT: SankeyLinkHighlight = 'links';
const DEFAULT_FADE: SankeyNodeFade & SankeyLinkFade = 'none';

/**
 * Get the node highlight configuration from the Sankey series.
 * Defaults to 'nodes' if not specified.
 */
export const selectorNodeHighlightConfig = createSelector(
  selectorSankeySeries,
  (series): SankeyNodeHighlight => series?.nodeOptions?.highlight ?? DEFAULT_NODE_HIGHLIGHT,
);

/**
 * Get the node fade configuration from the Sankey series.
 * Defaults to 'none' if not specified.
 */
export const selectorNodeFadeConfig = createSelector(
  selectorSankeySeries,
  (series): SankeyNodeFade => series?.nodeOptions?.fade ?? DEFAULT_FADE,
);

/**
 * Get the link highlight configuration from the Sankey series.
 * Defaults to 'links' if not specified.
 */
export const selectorLinkHighlightConfig = createSelector(
  selectorSankeySeries,
  (series): SankeyLinkHighlight => series?.linkOptions?.highlight ?? DEFAULT_LINK_HIGHLIGHT,
);

/**
 * Get the link fade configuration from the Sankey series.
 * Defaults to 'none' if not specified.
 */
export const selectorLinkFadeConfig = createSelector(
  selectorSankeySeries,
  (series): SankeyLinkFade => series?.linkOptions?.fade ?? DEFAULT_FADE,
);

/**
 * Get the currently highlighted item in the Sankey chart.
 * @param {UseSankeyHighlightSignature['state']} state The state of the chart.
 * @returns {SankeyItemIdentifier | null} The highlighted item identifier or null.
 */
export const selectorSankeyHighlightedItem = createSelector(
  selectorSankeyHighlight,
  (highlight) => highlight.item,
);

/**
 * Determines if a specific node should be highlighted.
 * A node is highlighted if:
 * - It's the highlighted node (unless highlight mode is 'none')
 * - It's connected to a highlighted link (based on linkOptions.highlight)
 */
export const selectorIsNodeHighlighted = createSelector(
  selectorSankeyHighlightedItem,
  selectorNodeHighlightConfig,
  selectorLinkHighlightConfig,
  (highlightedItem, nodeHighlight, linkHighlight, nodeId: SankeyNodeId): boolean => {
    if (!highlightedItem) {
      return false;
    }

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
  },
);

/**
 * Selector that determines if a specific link should be highlighted.
 * A link is highlighted if:
 * - It's the highlighted link (unless highlight mode is 'none')
 * - It's connected to a highlighted node (based on nodeOptions.highlight)
 */
export const selectorIsLinkHighlighted = createSelector(
  selectorSankeyHighlightedItem,
  selectorNodeHighlightConfig,
  selectorLinkHighlightConfig,
  (highlightedItem, nodeHighlight, linkHighlight, link: SankeyLayoutLink): boolean => {
    if (!highlightedItem) {
      return false;
    }

    if (
      highlightedItem.subType === 'link' &&
      highlightedItem.sourceId === link.source.id &&
      highlightedItem.targetId === link.target.id
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
          return link.source.id === highlightedNodeId || link.target.id === highlightedNodeId;
        case 'incoming':
          return link.target.id === highlightedNodeId;
        case 'outgoing':
          return link.source.id === highlightedNodeId;
        default:
          return false;
      }
    }

    return false;
  },
);

/**
 * Selector that determines if an item should be faded.
 * An item is faded if:
 * - There's a highlighted item
 * - This item is not highlighted
 * - The fade mode is 'global' for the highlighted element type
 */
export const selectorIsSankeyItemFaded = createSelector(
  selectorSankeyHighlightedItem,
  selectorNodeFadeConfig,
  selectorLinkFadeConfig,
  (highlightedItem, nodeFade, linkFade, isHighlighted: boolean): boolean => {
    if (!highlightedItem || isHighlighted) {
      return false;
    }

    const fadeMode = highlightedItem.subType === 'node' ? nodeFade : linkFade;

    return fadeMode === 'global';
  },
);
