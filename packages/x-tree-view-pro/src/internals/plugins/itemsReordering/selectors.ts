import { createSelectorMemoized } from '@mui/x-internals/store';
import { itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import type { TreeViewItemId } from '@mui/x-tree-view/models';
import type { RichTreeViewProState } from '../../RichTreeViewProStore';

export const itemsReorderingSelectors = {
  /**
   * Gets the properties of the current reordering.
   */
  currentReorder: (state: RichTreeViewProState<any, any>) => state.currentReorder,
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
  isDragging: (state: RichTreeViewProState<any, any>) => !!state.currentReorder?.draggedItemId,
  /**
   * Checks whether an item can be reordered.
   */
  canItemBeReordered: (state: RichTreeViewProState<any, any>, itemId: TreeViewItemId) =>
    !labelSelectors.isAnyItemBeingEdited(state) && state.isItemReorderable(itemId),
};
