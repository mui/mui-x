import {
  createSelector,
  TreeViewState,
  selectorItemMetaLookup,
  selectorIsAnyItemBeingEdited,
} from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';

/**
 * Get the items reordering state.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @returns {TreeViewItemsReorderingState} The items reordering state.
 */
const selectorItemsReordering = (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>) =>
  state.itemsReordering;

/**
 * Get the properties of the current reordering.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @returns {TreeViewItemsReorderingState['currentReorder']} The properties of the current reordering.
 */
export const selectorCurrentItemReordering = createSelector(
  [selectorItemsReordering],
  (itemsReordering) => itemsReordering.currentReorder,
);

/**
 * Get the properties of the dragged item.
 * @param {TreeViewState<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {TreeViewItemDraggedItemProperties | null} The properties of the dragged item if the current item is being dragged, `null` otherwise.
 */
export const selectorDraggedItemProperties = createSelector(
  [selectorCurrentItemReordering, selectorItemMetaLookup, (_, itemId: string) => itemId],
  (currentReorder, itemMetaLookup, itemId) => {
    if (
      !currentReorder ||
      currentReorder.targetItemId !== itemId ||
      currentReorder.action == null
    ) {
      return null;
    }

    const targetDepth =
      currentReorder.newPosition?.parentId == null
        ? 0
        : // The depth is always defined because drag&drop is only usable with Rich Tree View components.
          itemMetaLookup[itemId].depth! + 1;

    return {
      newPosition: currentReorder.newPosition,
      action: currentReorder.action,
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
export const selectorIsItemValidReorderingTarget = createSelector(
  [selectorCurrentItemReordering, (_, itemId: string) => itemId],
  (currentReorder, itemId) => currentReorder && currentReorder.draggedItemId !== itemId,
);

/**
 * Check if the items can be reordered.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {boolean} `true` if the items can be reordered, `false` otherwise.
 */
export const selectorCanItemBeReordered = createSelector(
  [selectorItemsReordering, selectorIsAnyItemBeingEdited, (_, itemId: string) => itemId],
  (itemsReordering, isEditing, itemId) => !isEditing && itemsReordering.isItemReorderable(itemId),
);
