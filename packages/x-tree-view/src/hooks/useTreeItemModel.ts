'use client';
import { useStore } from '@mui/x-internals/store';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import type { TreeViewDefaultItemModelProperties, TreeViewItemId } from '../models';
import { itemsSelectors } from '../internals/plugins/items';
import type { TreeViewAnyStore } from '../internals/models';

export const useTreeItemModel = <R extends {} = TreeViewDefaultItemModelProperties>(
  itemId: TreeViewItemId,
) => {
  const { store } = useTreeViewContext<TreeViewAnyStore>();
  return useStore(store, itemsSelectors.itemModel, itemId) as R | null;
};
