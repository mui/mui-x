import { createSelector } from '@mui/x-internals/store';
import { TreeViewState, itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';

export const itemsReorderingSelectors = {
  /**
   * Get the properties of the current reordering.
   * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
   * @returns {TreeViewItemsReorderingState['currentReorder']} The properties of the current reordering.
   */
  currentReorder: createSelector(
    (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>) =>
      state.itemsReordering.currentReorder,
  ),
  /**
   * Get the properties of the dragged item.
   * @param {TreeViewState<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item.
   * @returns {TreeViewItemDraggedItemProperties | null} The properties of the dragged item if the current item is being dragged, `null` otherwise.
   */
  draggedItemProperties: createSelector(
    (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>) =>
      state.itemsReordering.currentReorder,
    itemsSelectors.itemMetaLookup,
    (currentReorder, itemMetaLookup, itemId: TreeViewItemId) => {
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
  ),
  /**
   * Check if an item is a valid target for the dragged item.
   * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item.
   * @returns {boolean} Whether the item is a valid target for the dragged item.
   */
  isItemValidDropTarget: createSelector(
    (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>, itemId: TreeViewItemId) => {
      const draggedItemId = state.itemsReordering.currentReorder?.draggedItemId;
      return draggedItemId != null && draggedItemId !== itemId;
    },
  ),
  /**
   * Check if an item can be reordered.
   * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item.
   * @returns {boolean} Whether the item can be reordered.
   */
  canItemBeReordered: createSelector(
    (state: TreeViewState<[UseTreeViewItemsReorderingSignature]>) =>
      state.itemsReordering.isItemReorderable,
    labelSelectors.isAnyItemBeingEdited,
    (isItemReorderable, isEditing, itemId: TreeViewItemId) =>
      !isEditing && isItemReorderable(itemId),
  ),
};
