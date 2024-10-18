import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';

const selectorTreeViewItemsState: TreeViewRootSelector<UseTreeViewItemsSignature> = (state) =>
  state.items;

export const selectorItemMetaMap = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemMetaMap,
);

export const selectorItemOrderedChildrenIds = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemOrderedChildrenIds,
);

export const selectorItemChildrenIndexes = createSelector(
  selectorTreeViewItemsState,
  (items) => items.itemChildrenIndexes,
);

export const selectorItemMap = createSelector(selectorTreeViewItemsState, (items) => items.itemMap);

export const selectorItemMeta = createSelector(
  [selectorItemMetaMap, (_, itemId: string) => itemId],
  (itemMetaMap, itemId) => itemMetaMap[itemId],
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
