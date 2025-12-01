import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { RichTreeViewProState } from '../../RichTreeViewProStore';

export const itemsReorderingSelectors = {
  /**
   * Gets the properties of the current reordering.
   */
  currentReorder: createSelector((state: RichTreeViewProState<any, any>) => state.currentReorder),
  /**
   * Gets the properties of the dragged item.
   */
  draggedItemProperties: createSelectorMemoized(
    (state: RichTreeViewProState<any, any>) => state.currentReorder,
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
   * Checks whether an item is being dragged.
   */
  isDragging: createSelector(
    (state: RichTreeViewProState<any, any>) => !!state.currentReorder?.draggedItemId,
  ),
  /**
   * Checks whether an item can be reordered.
   */
  canItemBeReordered: createSelector(
    (state: RichTreeViewProState<any, any>) => state.isItemReorderable,
    labelSelectors.isAnyItemBeingEdited,
    (isItemReorderable, isEditing, itemId: TreeViewItemId) =>
      !isEditing && isItemReorderable(itemId),
  ),
};
