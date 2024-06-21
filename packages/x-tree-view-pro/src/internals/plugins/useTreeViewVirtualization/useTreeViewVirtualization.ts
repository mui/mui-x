import * as React from 'react';
import { TreeViewPlugin } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from './useTreeViewVirtualization.types';

export const useTreeViewVirtualization: TreeViewPlugin<UseTreeViewVirtualizationSignature> = ({
  params,
  state,
}) => {
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);

  return {
    instance: {
      getDimensions: () => state.virtualization,
    },
    contextValue: {
      virtualization: {
        virtualScrollerRef,
        scrollBufferPx: params.scrollBufferPx,
        itemsHeight: params.itemsHeight,
      },
    },
  };
};

useTreeViewVirtualization.getDefaultizedParams = (params) => ({
  ...params,
  enableVirtualization: params.enableVirtualization ?? false,
  scrollBufferPx: params.scrollBufferPx ?? 150,
  itemsHeight: params.itemsHeight ?? 32,
});

useTreeViewVirtualization.getInitialState = () => ({
  virtualization: { contentSize: 0, viewportHeight: 0 },
});

useTreeViewVirtualization.params = {
  enableVirtualization: true,
  scrollBufferPx: true,
  itemsHeight: true,
};
