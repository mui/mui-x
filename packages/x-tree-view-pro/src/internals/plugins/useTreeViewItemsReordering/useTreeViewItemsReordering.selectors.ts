import { createSelector, TreeViewState, selectorItemMetaMap } from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';

export const selectorItemsReordering = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature]>,
) => state.itemsReordering;

export const selectorItemsReorderingForDraggedItem = createSelector(
  [selectorItemsReordering, selectorItemMetaMap, (_, itemId: string) => itemId],
  (itemsReordering, itemMetaMap, itemId) => {
    if (
      !itemsReordering ||
      itemsReordering.targetItemId !== itemId ||
      itemsReordering.action == null
    ) {
      return null;
    }

    const targetDepth =
      itemsReordering.newPosition?.parentId == null
        ? 0
        : // The depth is always defined because drag&drop is only usable with Rich Tree View components.
          itemMetaMap[itemId].depth! + 1;

    return {
      newPosition: itemsReordering.newPosition,
      action: itemsReordering.action,
      targetDepth,
    };
  },
);

export const selectItemsReorderingIsValidDraggedItem = createSelector(
  [selectorItemsReordering, (_, itemId: string) => itemId],
  (itemsReordering, itemId) => itemsReordering && itemsReordering.draggedItemId === itemId,
);

export const selectorItemsReorderingIsValidTarget = createSelector(
  [selectorItemsReordering, (_, itemId: string) => itemId],
  (itemsReordering, itemId) => itemsReordering && itemsReordering.draggedItemId !== itemId,
);
