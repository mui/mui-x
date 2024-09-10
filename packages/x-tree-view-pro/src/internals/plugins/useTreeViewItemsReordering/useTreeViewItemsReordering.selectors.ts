import { createSelector, TreeViewState, selectorItemMetaMap } from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';

export const selectorItemsReordering = createSelector(
  (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>) => state.itemsReordering,
);

export const selectorItemsReorderingForDraggedItem = createSelector(
  selectorItemsReordering,
  selectorItemMetaMap,
  (itemsReordering, itemMetaMap, itemId: string) => {
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

export const selectorItemsReorderingIsValidTarget = createSelector(
  selectorItemsReordering,
  (itemsReordering, itemId: string) => itemsReordering && itemsReordering.draggedItemId !== itemId,
);
