import type { KeyboardFocusHandler, FocusedItemUpdater } from '@mui/x-charts/internals';

// ====================================================================================================================
//
// Info: This file uses node.layer and not node.depth to navigate between nodes on the same level.
//
// - depth is the graph depth, starting at 0 on the left, increasing by 1 for each link to the right.
// - layer is the visual level of the node. It takes into consideration the node alignment (left/right/justify/center)
//
// ====================================================================================================================

const getFirstNode: FocusedItemUpdater<'sankey', 'sankey'> = (_, state) => {
  // If no node is defined, find the first node with layer = 0
  const seriesId = state.series.defaultizedSeries.sankey?.seriesOrder[0];
  if (!seriesId || !state.series.defaultizedSeries.sankey) {
    return null;
  }
  const series = state.series.defaultizedSeries.sankey.series[seriesId];

  if (series.data.nodes.length > 0) {
    const index = series.data.nodes.findIndex((node) => node.layer === 0);
    return { seriesId, type: 'sankey', subType: 'node', nodeId: series.data.nodes[index].id };
  }
  return null;
};

const getNodeToNode =
  (step: -1 | 1): FocusedItemUpdater<'sankey', 'sankey'> =>
  (currentItem, state) => {
    if (currentItem && currentItem.subType === 'node') {
      const data = state.series.defaultizedSeries.sankey?.series[currentItem.seriesId].data;
      const currentNodeIndex = data?.nodes.findIndex((node) => node.id === currentItem.nodeId);

      if (currentNodeIndex === undefined || currentNodeIndex < 0 || !data) {
        return getFirstNode(null, state);
      }

      const currentNode = data.nodes[currentNodeIndex];
      for (let i = 1; i <= data.nodes.length; i += 1) {
        const index = (data.nodes.length + currentNodeIndex + step * i) % data.nodes.length;
        if (data.nodes[index].layer === currentNode.layer) {
          return {
            seriesId: currentItem.seriesId,
            type: 'sankey',
            subType: 'node',
            nodeId: data.nodes[index].id,
          };
        }
      }
    }
    // If we fail, we fallback on the first node
    return getFirstNode(null, state);
  };

const getNodeToLink =
  (step: 'source' | 'target'): FocusedItemUpdater<'sankey', 'sankey'> =>
  (currentItem, state) => {
    if (currentItem && currentItem.subType === 'node') {
      const data = state.series.defaultizedSeries.sankey?.series[currentItem.seriesId].data;
      const currentNodeIndex = data?.nodes.findIndex((node) => node.id === currentItem.nodeId);

      if (currentNodeIndex === undefined || currentNodeIndex < 0 || !data) {
        return getFirstNode(null, state);
      }

      const currentNode = data.nodes[currentNodeIndex];

      const links = step === 'source' ? currentNode.sourceLinks : currentNode.targetLinks;
      if (links.length === 0) {
        // No link in that direction, we stay where we are.
        return currentItem;
      }
      return {
        seriesId: currentItem.seriesId,
        type: 'sankey',
        subType: 'link',
        sourceId: links[0].source.id,
        targetId: links[0].target.id,
      };
    }
    // If we fail, we fallback on the first node
    return getFirstNode(null, state);
  };

const getLinkToNode =
  (step: 'source' | 'target'): FocusedItemUpdater<'sankey', 'sankey'> =>
  (currentItem, state) => {
    if (currentItem && currentItem.subType === 'link') {
      const nodeId = step === 'source' ? currentItem.sourceId : currentItem.targetId;
      return { seriesId: currentItem.seriesId, type: 'sankey', subType: 'node', nodeId };
    }
    return getFirstNode(null, state);
  };

const getLinkToLink =
  (step: -1 | 1): FocusedItemUpdater<'sankey', 'sankey'> =>
  (currentItem, state) => {
    if (currentItem && currentItem.subType === 'link') {
      const data = state.series.defaultizedSeries.sankey?.series[currentItem.seriesId].data;
      const currentLinkIndex = data?.links.findIndex(
        (link) =>
          link.source.id === currentItem.sourceId && link.target.id === currentItem.targetId,
      );

      if (currentLinkIndex === undefined || currentLinkIndex < 0 || !data) {
        return getFirstNode(null, state);
      }

      for (let i = 1; i <= data.links.length; i += 1) {
        const index = (data.links.length + currentLinkIndex + step * i) % data.links.length;
        if (data.links[index].source.id === currentItem.sourceId) {
          return {
            seriesId: currentItem.seriesId,
            type: 'sankey',
            subType: 'link',
            sourceId: data.links[index].source.id,
            targetId: data.links[index].target.id,
          };
        }
      }
    }

    return getFirstNode(null, state);
  };

const keyboardFocusHandler: KeyboardFocusHandler<'sankey', 'sankey'> =
  (event) => (currentItem, state) => {
    const isLink = currentItem?.subType === 'link';

    switch (event.key) {
      case 'ArrowDown':
        return isLink ? getLinkToLink(1)(currentItem, state) : getNodeToNode(1)(currentItem, state);
      case 'ArrowUp':
        return isLink
          ? getLinkToLink(-1)(currentItem, state)
          : getNodeToNode(-1)(currentItem, state);
      case 'ArrowRight':
        return isLink
          ? getLinkToNode('target')(currentItem, state)
          : getNodeToLink('source')(currentItem, state);
      case 'ArrowLeft':
        return isLink
          ? getLinkToNode('source')(currentItem, state)
          : getNodeToLink('target')(currentItem, state);
      default:
        return currentItem;
    }
  };

export default keyboardFocusHandler;
