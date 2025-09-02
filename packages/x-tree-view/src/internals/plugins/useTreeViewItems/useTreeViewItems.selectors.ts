import { createSelector } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewItemMeta, TreeViewState } from '../../models';
import { isItemDisabled, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';

const EMPTY_CHILDREN: TreeViewItemId[] = [];

export const itemsSelectors = {
  /**
   * Gets the loading state for the Tree View.
   */
  isLoading: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.loading,
  ),
  /**
   * Gets the error state for the Tree View.
   */
  error: createSelector((state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.error),
  /**
   * Gets the DOM structure of the Tree View.
   */
  domStructure: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.domStructure,
  ),
  /**
   * Checks whether the disabled items are focusable.
   */
  disabledItemFocusable: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.disabledItemsFocusable,
  ),
  /**
   * Gets the meta-information of all items.
   */
  itemMetaLookup: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.itemMetaLookup,
  ),
  /**
   * Gets the ordered children ids of all items.
   */
  itemOrderedChildrenIdsLookup: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>) => state.items.itemOrderedChildrenIdsLookup,
  ),
  /**
   * Gets the meta-information of an item.
   */
  itemMeta: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId | null) =>
      (state.items.itemMetaLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ??
        null) as TreeViewItemMeta | null,
  ),
  /**
   * Gets the ordered children ids of an item.
   */
  itemOrderedChildrenIds: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId | null) =>
      state.items.itemOrderedChildrenIdsLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ??
      EMPTY_CHILDREN,
  ),
  /**
   * Gets the model of an item.
   */
  itemModel: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemModelLookup[itemId],
  ),
  /**
   * Checks whether an item is disabled.
   */
  isItemDisabled: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      isItemDisabled(state.items.itemMetaLookup, itemId),
  ),
  /**
   * Gets the index of an item in its parent's children.
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
   * Gets the id of an item's parent.
   */
  itemParentId: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemMetaLookup[itemId]?.parentId ?? null,
  ),
  /**
   * Gets the depth of an item (items at the root level have a depth of 0).
   */
  itemDepth: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.itemMetaLookup[itemId]?.depth ?? 0,
  ),
  /**
   * Checks whether an item can be focused.
   */
  canItemBeFocused: createSelector(
    (state: TreeViewState<[UseTreeViewItemsSignature]>, itemId: TreeViewItemId) =>
      state.items.disabledItemsFocusable || !isItemDisabled(state.items.itemMetaLookup, itemId),
  ),
};
