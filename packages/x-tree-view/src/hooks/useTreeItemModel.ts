'use client';
import { useStore } from '@base-ui-components/utils/store';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { TreeViewBaseItem, TreeViewDefaultItemModelProperties, TreeViewItemId } from '../models';
import { itemsSelectors, UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';

export const useTreeItemModel = <R extends {} = TreeViewDefaultItemModelProperties>(
  itemId: TreeViewItemId,
) => {
  const { store } = useTreeViewContext<[UseTreeViewItemsSignature]>();
  return useStore(store, itemsSelectors.itemModel, itemId) as unknown as TreeViewBaseItem<R> | null;
};
