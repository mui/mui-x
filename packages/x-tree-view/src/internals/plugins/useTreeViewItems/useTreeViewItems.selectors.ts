import { TreeViewItemId } from '../../../models';
import { TreeViewItemMeta } from '../../models';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';
import { TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';

const selectorTreeViewItemsState: TreeViewRootSelector<UseTreeViewItemsSignature> = (state) =>
  state.items;

export const selectorItemMetaMap = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemMetaMap,
);

// Never used outside of this file, always use selectorItemOrderedChildrenIds instead.
const selectorItemOrderedChildrenIdsMap = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemOrderedChildrenIds,
);

const EMPTY_CHILDREN: TreeViewItemId[] = [];
export const selectorItemOrderedChildrenIds = createSelector(
  [selectorItemOrderedChildrenIdsMap, (_, itemId: string | null) => itemId],
  (itemOrderedChildrenIdsMap, itemId) =>
    itemOrderedChildrenIdsMap[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? EMPTY_CHILDREN,
);

export const selectorItemChildrenIndexes = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemChildrenIndexes,
);

export const selectorItemMap = createSelector(selectorTreeViewItemsState, (items) => items.itemMap);

export const selectorItem = createSelector(
  [selectorItemMap, (_, itemId: string) => itemId],
  (itemMap, itemId) => itemMap[itemId],
);

/**
 * Get the meta-information of an item.
 * Check the `TreeViewItemMeta` type for more information.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>}
 * @param {TreeViewItemId} itemId The id of the item to get the meta-information of.
 * @returns {TreeViewItemMeta | null} The meta-information of the item.
 */
export const selectorItemMeta = createSelector(
  [selectorItemMetaMap, (_, itemId: string | null) => itemId],
  (itemMetaMap, itemId) =>
    (itemMetaMap[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? null) as TreeViewItemMeta | null,
);

export const selectorIsItemDisabled = createSelector(
  [selectorItemMetaMap, (_, itemId: string) => itemId],
  (itemMetaMap, itemId) => {
    if (itemId == null) {
      return false;
    }

    let itemMeta = itemMetaMap[itemId];

    // This can be called before the item has been added to the item map.
    if (!itemMeta) {
      return false;
    }

    if (itemMeta.disabled) {
      return true;
    }

    while (itemMeta.parentId != null) {
      itemMeta = itemMetaMap[itemMeta.parentId];
      if (itemMeta.disabled) {
        return true;
      }
    }

    return false;
  },
);

/**
 * Get the index of a given item in its parent's children list.
 */
export const selectorItemIndex = createSelector(
  [selectorItemMeta, selectorItemChildrenIndexes],
  (itemMeta, indexes) =>
    itemMeta == null ? -1 : indexes[itemMeta.parentId ?? TREE_VIEW_ROOT_PARENT_ID][itemMeta.id],
);

export const selectorItemParentId = createSelector(
  [selectorItemMeta],
  (itemMeta) => itemMeta?.parentId ?? null,
);
