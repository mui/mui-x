import { createSelector } from '@base-ui-components/utils/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewItemMeta, TreeViewState } from '../../models';
import { isItemDisabled, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';

const EMPTY_CHILDREN: TreeViewItemId[] = [];

export const itemsSelectors = {
  /**
   * Get the loading state for the Tree View.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @returns {boolean} The loading state for the Tree View.
   */
  isLoading: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.loading,
  ),
  /**
   * Get the error state for the Tree View.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @returns {boolean} The error state for the Tree View.
   */
  error: createSelector((state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.error),
  /**
   * Check if the disabled items are focusable.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @returns {boolean} Whether the disabled items are focusable.
   */
  disabledItemFocusable: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.disabledItemsFocusable,
  ),
  /**
   * Get the meta-information of all items.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @returns {TreeViewItemMetaLookup} The meta-information of all items.
   */
  itemMetaLookup: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.itemMetaLookup,
  ),
  itemMeta: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId | null) =>
      (state.items.itemMetaLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ??
        null) as TreeViewItemMeta | null,
  ),
  /**
   * Get the ordered children ids of a given item.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId | null} itemId The id of the item to get the children of.
   * @returns {TreeViewItemId[]} The ordered children ids of the item.
   */
  itemOrderedChildrenIds: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId | null) =>
      state.items.itemOrderedChildrenIdsLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ??
      EMPTY_CHILDREN,
  ),
  /**
   * Get the model of an item.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to get the model of.
   * @returns {R} The model of the item.
   */
  itemModel: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemModelLookup[itemId],
  ),
  /**
   * Check if an item is disabled.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether the item is disabled.
   */
  isItemDisabled: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      isItemDisabled(state.items.itemMetaLookup, itemId),
  ),
  /**
   * Get the index of an item in its parent's children.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to get the index of.
   * @returns {number} The index of the item in its parent's children.
   */
  itemIndex: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) => {
      const itemMeta = state.items.itemMetaLookup[itemId];
      if (itemMeta == null) {
        return -1;
      }

      const parentIndexes =
        state.items.itemChildrenIndexesLookup[itemMeta.parentId ?? TREE_VIEW_ROOT_PARENT_ID];
      return parentIndexes[itemMeta.id];
    },
  ),
  /**
   * Get the index of an item in its parent's children.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to get the index of.
   * @returns {number} The index of the item in its parent's children.
   */
  itemParentId: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemMetaLookup[itemId]?.parentId ?? null,
  ),
  /**
   * Get the depth of an item (items at the root level have a depth of 0).
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to get the depth of.
   * @returns {number} The depth of the item.
   */
  itemDepth: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemMetaLookup[itemId]?.depth ?? 0,
  ),
  /**
   * Check if an item can be focused.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether the item can be focused.
   */
  canItemBeFocused: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.disabledItemsFocusable || !isItemDisabled(state.items.itemMetaLookup, itemId),
  ),
};
