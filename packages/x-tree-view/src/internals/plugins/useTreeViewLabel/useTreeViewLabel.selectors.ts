import { createSelector } from '@mui/x-internals/store';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewState } from '../../models';
import { TreeViewItemId } from '../../../models';

export const labelSelectors = {
  /**
   * Checks whether an item is editable.
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
   * Checks whether an item is being edited.
   */
  isItemBeingEdited: createSelector(
    (state: TreeViewState<[], [UseTreeViewLabelSignature]>, itemId: TreeViewItemId | null) =>
      itemId == null ? false : state.label?.editedItemId === itemId,
  ),
  /**
   * Checks whether any item is being edited.
   */
  isAnyItemBeingEdited: createSelector(
    (state: TreeViewState<[], [UseTreeViewLabelSignature]>) => !!state.label?.editedItemId,
  ),
};
