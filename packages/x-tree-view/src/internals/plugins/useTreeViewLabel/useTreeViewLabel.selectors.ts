import { createSelector } from '@base-ui-components/utils/store';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { selectorItemModel } from '../useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewState } from '../../models';
import { TreeViewItemId } from '../../../models';

const selectorTreeViewLabelStateOptional = createSelector(
  (state: TreeViewState<[], [UseTreeViewLabelSignature]>) => state.label,
);

/**
 * Check if an item is editable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is editable, `false` otherwise.
 */
export const selectorIsItemEditable = createSelector(
  selectorTreeViewLabelStateOptional,
  selectorItemModel,
  (labelState, itemModel, _itemId: TreeViewItemId) => {
    if (!itemModel || !labelState) {
      return false;
    }

    if (typeof labelState.isItemEditable === 'boolean') {
      return labelState.isItemEditable;
    }

    return labelState.isItemEditable(itemModel);
  },
);

/**
 * Check if the given item is being edited.
 * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
 * @param {TreeViewItemId | null} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is being edited, `false` otherwise.
 */
export const selectorIsItemBeingEdited = createSelector(
  selectorTreeViewLabelStateOptional,
  (labelState, itemId: TreeViewItemId | null) =>
    itemId ? labelState?.editedItemId === itemId : false,
);

/**
 * Check if an item is being edited.
 * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if an item is being edited, `false` otherwise.
 */
export const selectorIsAnyItemBeingEdited = createSelector(
  selectorTreeViewLabelStateOptional,
  (labelState) => !!labelState?.editedItemId,
);
