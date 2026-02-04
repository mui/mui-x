import { createSelector } from '@mui/x-internals/store';
import { itemsSelectors } from '../items/selectors';
import { RichTreeViewState } from '../../RichTreeViewStore';
import { TreeViewItemId } from '../../../models';

export const labelSelectors = {
  /**
   * Checks whether an item is editable.
   */
  isItemEditable: createSelector(
    (state: RichTreeViewState<any, any>) => state.isItemEditable,
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
   * Checks whether an item is being edited.
   */
  isItemBeingEdited: createSelector(
    (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
      itemId == null ? false : state.editedItemId === itemId,
  ),
  /**
   * Checks whether any item is being edited.
   */
  isAnyItemBeingEdited: createSelector(
    (state: RichTreeViewState<any, any>) => !!state.editedItemId,
  ),
};
