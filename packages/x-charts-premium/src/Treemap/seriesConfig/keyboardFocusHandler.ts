import type { KeyboardFocusHandler, FocusedItemUpdater } from '@mui/x-charts/internals';

// Treemap keyboard navigation walks the hierarchy:
// - ArrowUp / ArrowDown: parent / first child (levels)
// - ArrowLeft / ArrowRight: previous / next sibling (cyclic)

const getFirstNode: FocusedItemUpdater<'treemap', 'treemap'> = (_, state) => {
  const seriesId = state.series.defaultizedSeries.treemap?.seriesOrder[0];
  if (!seriesId || !state.series.defaultizedSeries.treemap) {
    return null;
  }
  const { nodes } = state.series.defaultizedSeries.treemap.series[seriesId].data;
  // Prefer the first node below the (possibly synthetic) root.
  const first = nodes.find((node) => node.depth === 1) ?? nodes.find((node) => node.depth === 0);
  if (!first) {
    return null;
  }
  return { seriesId, type: 'treemap', nodeId: first.id };
};

const getSibling =
  (step: -1 | 1): FocusedItemUpdater<'treemap', 'treemap'> =>
  (currentItem, state) => {
    if (!currentItem) {
      return getFirstNode(null, state);
    }
    const data = state.series.defaultizedSeries.treemap?.series[currentItem.seriesId]?.data;
    const node = data?.byId.get(currentItem.nodeId);
    if (!data || !node) {
      return getFirstNode(null, state);
    }

    // A focusable node (depth >= 1) always has a parent; its siblings are the parent's
    // children. The root itself (parentId null) is never focused.
    const siblings = node.parentId == null ? [] : (data.byId.get(node.parentId)?.childrenIds ?? []);

    if (siblings.length === 0) {
      return currentItem;
    }

    const index = siblings.indexOf(node.id);
    const nextIndex = (siblings.length + index + step) % siblings.length;
    return { seriesId: currentItem.seriesId, type: 'treemap', nodeId: siblings[nextIndex] };
  };

const getParent: FocusedItemUpdater<'treemap', 'treemap'> = (currentItem, state) => {
  if (!currentItem) {
    return getFirstNode(null, state);
  }
  const data = state.series.defaultizedSeries.treemap?.series[currentItem.seriesId]?.data;
  const node = data?.byId.get(currentItem.nodeId);
  // Stop at depth 1: the depth-0 root is structural and never rendered.
  if (!data || !node || node.depth <= 1 || node.parentId == null) {
    return currentItem;
  }
  return { seriesId: currentItem.seriesId, type: 'treemap', nodeId: node.parentId };
};

const getChild: FocusedItemUpdater<'treemap', 'treemap'> = (currentItem, state) => {
  if (!currentItem) {
    return getFirstNode(null, state);
  }
  const data = state.series.defaultizedSeries.treemap?.series[currentItem.seriesId]?.data;
  const node = data?.byId.get(currentItem.nodeId);
  if (!data || !node || node.childrenIds.length === 0) {
    return currentItem;
  }
  return { seriesId: currentItem.seriesId, type: 'treemap', nodeId: node.childrenIds[0] };
};

const keyboardFocusHandler: KeyboardFocusHandler<'treemap', 'treemap'> =
  (event) => (currentItem, state) => {
    switch (event.key) {
      case 'ArrowUp':
        return getParent(currentItem, state);
      case 'ArrowDown':
        return getChild(currentItem, state);
      case 'ArrowLeft':
        return getSibling(-1)(currentItem, state);
      case 'ArrowRight':
        return getSibling(1)(currentItem, state);
      default:
        return currentItem;
    }
  };

export default keyboardFocusHandler;
