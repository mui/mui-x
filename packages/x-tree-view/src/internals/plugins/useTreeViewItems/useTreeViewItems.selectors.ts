import { createSelector } from '../../utils/createSelector';
import {
  UseTreeViewItemsSignature,
  TreeViewItemMetaMap,
  TreeViewItemMap,
} from './useTreeViewItems.types';

export const selectorItemMetaMap = createSelector<UseTreeViewItemsSignature, TreeViewItemMetaMap>(
  (storeValue) => storeValue.items.itemMetaMap,
);

export const selectorItemOrderedChildrenIds = createSelector<
  UseTreeViewItemsSignature,
  { [parentItemId: string]: string[] }
>((storeValue) => storeValue.items.itemOrderedChildrenIds);

export const selectorItemChildrenIndexes = createSelector<
  UseTreeViewItemsSignature,
  { [parentItemId: string]: { [itemId: string]: number } }
>((storeValue) => storeValue.items.itemChildrenIndexes);

export const selectorItemMap = createSelector<UseTreeViewItemsSignature, TreeViewItemMap<any>>(
  (storeValue) => storeValue.items.itemMap,
);
