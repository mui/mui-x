import { useTreeViewContext } from '../internals/TreeViewProvider';
import { useSelector } from '../internals/hooks/useSelector';
import { selectorItem } from '../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { TreeViewItemId } from '../models';

export const useTreeItemModel = <R extends {}>(itemId: TreeViewItemId) => {
  const { store } = useTreeViewContext();
  return useSelector(store, selectorItem, itemId) as R | null;
};
