import { TreeViewPlugin } from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';
import { useTreeViewItemsReorderingItemPlugin } from './useTreeViewItemsReordering.itemPlugin';

export const useTreeViewItemsReordering: TreeViewPlugin<
  UseTreeViewItemsReorderingSignature
> = () => {
  return {
    instance: {},
  };
};

useTreeViewItemsReordering.itemPlugin = useTreeViewItemsReorderingItemPlugin;

useTreeViewItemsReordering.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  itemsReordering: params.itemsReordering ?? false,
});

useTreeViewItemsReordering.getInitialState = (params) => ({
  itemsReordering: {
    currentReorder: null,
    isItemReorderable: params.itemsReordering
      ? (params.isItemReorderable ?? (() => true))
      : () => false,
  },
});

useTreeViewItemsReordering.params = {
  itemsReordering: true,
  isItemReorderable: true,
  canMoveItemToNewPosition: true,
  onItemPositionChange: true,
};
