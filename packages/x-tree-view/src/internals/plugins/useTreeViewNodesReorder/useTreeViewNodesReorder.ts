import { TreeViewPlugin } from '../../models';
import { UseTreeViewNodesReorderSignature } from './useTreeViewNodesReorder.types';

export const useTreeViewNodesReorder: TreeViewPlugin<UseTreeViewNodesReorderSignature> = ({
  params,
}) => {
  return {
    contextValue: {
      itemsReordering: params.itemsReordering,
    },
  };
};

useTreeViewNodesReorder.getDefaultizedParams = (params) => ({
  ...params,
  itemsReordering: params.itemsReordering ?? false,
});

useTreeViewNodesReorder.params = {
  itemsReordering: true,
};
