import * as React from 'react';
import { TreeViewPlugin } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from './useTreeViewVirtualization.types';

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = ({ state }) => {
  const virtualScrollerRef = React.useRef<HTMLUListElement>(null);

  return {
    instance: {
      virtualScrollerRef,
      getDimensions: () => state.virtualization,
    },
  };
};

useTreeViewVirtualization.getDefaultizedParams = (params) => ({
  ...params,
  enableVirtualization: params.enableVirtualization ?? false,
});

useTreeViewVirtualization.getInitialState = () => ({
  virtualization: { contentSize: 0, viewportHeight: 0 },
});

useTreeViewVirtualization.params = { enableVirtualization: true };
