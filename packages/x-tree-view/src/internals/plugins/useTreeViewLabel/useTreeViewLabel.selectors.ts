import { createSelector } from '@mui/x-internals/store';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewState } from '../../models';
import { TreeViewItemId } from '../../../models';

export const labelSelectors = {
  /**
   * Check if an item is editable.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether the item is editable.
   */
  isItemEditable: createSelector(
    (state: TreeViewState<[], [UseTreeViewLabelSignature]>) => state.label?.isItemEditable,
    itemsSelectors.itemModel,
    (isItemEditable, itemModel, _itemId: TreeViewItemId) => {
      if (!itemModel || isItemEditable == null) {
        return false;
      }

      if (typeof isItemEditable === 'boolean') {
        return isItemEditable;
      }

      return isItemEditable(itemModel);
    },
  ),
  /**
   * Check if the given item is being edited.
   * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
   * @param {TreeViewItemId | null} itemId The id of the item to check.
   * @returns {boolean} Whether the item is being edited.
   */
  isItemBeingEdited: createSelector(
    (state: TreeViewState<[], [UseTreeViewLabelSignature]>, itemId: TreeViewItemId | null) =>
      itemId == null ? false : state.label?.editedItemId === itemId,
  ),
  /**
   * Check if an item is being edited.
   * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
   * @returns {boolean} Whether an item is being edited.
   */
  isAnyItemBeingEdited: createSelector(
    (state: TreeViewState<[], [UseTreeViewLabelSignature]>) => !!state.label?.editedItemId,
  ),
};
