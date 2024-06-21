import * as React from 'react';
import { TreeViewPlugin } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from './useTreeViewVirtualization.types';

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = () => {
  const virtualScrollerRef = React.useRef<HTMLUListElement>(null);

  return {
    instance: {
      virtualScrollerRef,
    },
  };
};

useTreeViewVirtualization.getDefaultizedParams = (params) => ({
  ...params,
  enableVirtualization: params.enableVirtualization ?? false,
});

useTreeViewVirtualization.params = { enableVirtualization: true };
