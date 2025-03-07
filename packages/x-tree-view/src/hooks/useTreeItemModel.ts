'use client';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { useSelector } from '../internals/hooks/useSelector';
import { selectorItemModel } from '../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewBaseItem, TreeViewDefaultItemModelProperties, TreeViewItemId } from '../models';

export const useTreeItemModel = <R extends {} = TreeViewDefaultItemModelProperties>(
  itemId: TreeViewItemId,
) => {
  const { store } = useTreeViewContext();
  return useSelector(store, selectorItemModel, itemId) as unknown as TreeViewBaseItem<R> | null;
};
