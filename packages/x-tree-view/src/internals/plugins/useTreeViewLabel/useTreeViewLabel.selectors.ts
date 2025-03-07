import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorItemModel } from '../useTreeViewItems/useTreeViewItems.selectors';

const selectorTreeViewLabelState: TreeViewRootSelector<UseTreeViewLabelSignature> = (state) =>
  state.label;

/**
 * Check if an item is editable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {object} params The parameters.
 * @param {TreeViewItemId} params.itemId The id of the item to check.
 * @param {((item: any) => boolean) | boolean} params.isItemEditable The function to determine if an item is editable.
 * @returns {boolean} `true` if the item is editable, `false` otherwise.
 */
export const selectorIsItemEditable = createSelector(
  [
    (_, args: { itemId: string; isItemEditable: ((item: any) => boolean) | boolean }) => args,
    (state, args) => selectorItemModel(state, args.itemId),
  ],
  (args, itemModel) => {
    if (!itemModel || !args.isItemEditable) {
      return false;
    }

    return typeof args.isItemEditable === 'function' ? args.isItemEditable(itemModel) : true;
  },
);

/**
 * Check if an item is being edited.
 * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is being edited, `false` otherwise.
 */
export const selectorIsItemBeingEdited = createSelector(
  [selectorTreeViewLabelState, (_, itemId: string) => itemId],
  (labelState, itemId) => labelState.editedItemId === itemId,
);
