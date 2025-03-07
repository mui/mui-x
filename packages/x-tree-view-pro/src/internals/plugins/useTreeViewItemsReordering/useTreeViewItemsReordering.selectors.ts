import { createSelector, TreeViewState, selectorItemMetaLookup } from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';

/**
 * Get the items reordering state.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @returns {TreeViewItemsReorderingState | null} The items reordering state.
 */
export const selectorItemsReordering = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature]>,
) => state.itemsReordering;

/**
 * Get the properties of the dragged item.
 * @param {TreeViewState<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {TreeViewItemDraggedItemProperties | null} The properties of the dragged item if the current item is being dragged, `null` otherwise.
 */
export const selectorItemsReorderingDraggedItemProperties = createSelector(
  [selectorItemsReordering, selectorItemMetaLookup, (_, itemId: string) => itemId],
  (itemsReordering, itemMetaLookup, itemId) => {
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
          itemMetaLookup[itemId].depth! + 1;

    return {
      newPosition: itemsReordering.newPosition,
      action: itemsReordering.action,
      targetDepth,
    };
  },
);

/**
 * Check if the current item is a valid target for the dragged item.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {boolean} `true` if the current item is a valid target for the dragged item, `false` otherwise.
 */
export const selectorItemsReorderingIsValidTarget = createSelector(
  [selectorItemsReordering, (_, itemId: string) => itemId],
  (itemsReordering, itemId) => itemsReordering && itemsReordering.draggedItemId !== itemId,
);
