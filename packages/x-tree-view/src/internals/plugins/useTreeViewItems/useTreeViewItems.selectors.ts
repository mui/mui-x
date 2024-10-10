import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewItemsSignature, UseTreeViewItemsState } from './useTreeViewItems.types';

const selectorItems: TreeViewRootSelector<
  [UseTreeViewItemsSignature],
  UseTreeViewItemsState<any>['items']
> = (state) => state.items;

export const selectorItemMetaMap = createSelector(selectorItems, (items) => items.itemMetaMap);

export const selectorItemOrderedChildrenIds = createSelector(
  selectorItems,
  (items) => items.itemOrderedChildrenIds,
);

export const selectorItemChildrenIndexes = createSelector(
  selectorItems,
  (items) => items.itemChildrenIndexes,
);

export const selectorItemMap = createSelector(selectorItems, (items) => items.itemMap);

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
