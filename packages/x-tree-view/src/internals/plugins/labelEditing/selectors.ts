import { itemsSelectors } from '../items/selectors';
import type { RichTreeViewState } from '../../RichTreeViewStore';
import type { TreeViewItemId } from '../../../models';

export const labelSelectors = {
  /**
   * Checks whether an item is editable.
   */
  isItemEditable: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId) => {
    const isItemEditable = state.isItemEditable;
    const itemModel = itemsSelectors.itemModel(state, itemId);
    if (!itemModel || isItemEditable == null) {
      return false;
    }

    if (typeof isItemEditable === 'boolean') {
      return isItemEditable;
    }

    return isItemEditable(itemModel);
  },
  /**
   * Checks whether an item is being edited.
   */
  isItemBeingEdited: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    itemId == null ? false : state.editedItemId === itemId,
  /**
   * Checks whether any item is being edited.
   */
  isAnyItemBeingEdited: (state: RichTreeViewState<any, any>) => !!state.editedItemId,
};
