'use client';
import { useStore } from '@base-ui-components/utils/store';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { selectorItemModel } from '../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewBaseItem, TreeViewDefaultItemModelProperties, TreeViewItemId } from '../models';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';

export const useTreeItemModel = <R extends {} = TreeViewDefaultItemModelProperties>(
  itemId: TreeViewItemId,
) => {
  const { store } = useTreeViewContext<[UseTreeViewItemsSignature]>();
  return useStore(store, selectorItemModel, itemId) as unknown as TreeViewBaseItem<R> | null;
};
