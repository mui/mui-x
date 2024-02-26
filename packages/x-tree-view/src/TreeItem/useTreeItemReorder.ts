import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals';

export const useTreeItemReorder = (): React.HTMLAttributes<HTMLLIElement> => {
  const { itemsReordering } = useTreeViewContext<DefaultTreeViewPlugins>();

  if (!itemsReordering) {
    return {};
  }

  return {
    draggable: true,
  };
};
