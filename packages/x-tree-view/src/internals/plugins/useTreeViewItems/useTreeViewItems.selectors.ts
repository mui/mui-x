import { createSelector } from '../../utils/selectors';
import {
  UseTreeViewItemsSignature,
  TreeViewItemMetaMap,
  TreeViewItemMap,
} from './useTreeViewItems.types';
import { TreeViewState } from '../../models';

export const selectorItemMetaMap = createSelector<[UseTreeViewItemsSignature], TreeViewItemMetaMap>(
  (state) => state.items.itemMetaMap,
);

export const selectorItemOrderedChildrenIds = createSelector<
  [UseTreeViewItemsSignature],
  { [parentItemId: string]: string[] }
>((state) => state.items.itemOrderedChildrenIds);

export const selectorItemChildrenIndexes = createSelector<
  [UseTreeViewItemsSignature],
  { [parentItemId: string]: { [itemId: string]: number } }
>((state) => state.items.itemChildrenIndexes);

export const selectorItemMap = createSelector<[UseTreeViewItemsSignature], TreeViewItemMap<any>>(
  (state) => state.items.itemMap,
);

export const selectorItemMeta = (
  state: TreeViewState<[UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  return selectorItemMetaMap(state)[itemId];
};

export const selectorIsItemDisabled = (
  state: TreeViewState<[UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  if (itemId == null) {
    return false;
  }

  let itemMeta = selectorItemMeta(state, itemId);

  // This can be called before the item has been added to the item map.
  if (!itemMeta) {
    return false;
  }

  if (itemMeta.disabled) {
    return true;
  }

  while (itemMeta.parentId != null) {
    itemMeta = selectorItemMeta(state, itemMeta.parentId);
    if (itemMeta.disabled) {
      return true;
    }
  }

  return false;
};
