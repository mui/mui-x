import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorItemModel } from '../useTreeViewItems/useTreeViewItems.selectors';

const selectorTreeViewLabelState: TreeViewRootSelector<UseTreeViewLabelSignature, true> = (state) =>
  state.label;

/**
 * Check if an item is editable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is editable, `false` otherwise.
 */
export const selectorIsItemEditable = createSelector(
  [selectorTreeViewLabelState, (state, itemId: string) => selectorItemModel(state, itemId)],
  (labelState, itemModel) => {
    if (!itemModel || !labelState) {
      return false;
    }

    return labelState.isItemEditable(itemModel);
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
  (labelState, itemId) => labelState?.editedItemId === itemId,
);
