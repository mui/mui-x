import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '@mui/x-tree-view/internals';

export interface UseTreeViewVirtualizationInstance {
  virtualScrollerRef: React.RefObject<HTMLUListElement>;
  getDimensions: () => UseTreeViewVirtualizationState['virtualization'];
}

export interface UseTreeViewVirtualizationParameters {
  enableVirtualization?: boolean;
}

export type UseTreeViewVirtualizationDefaultizedParameters = DefaultizedProps<
  UseTreeViewVirtualizationParameters,
  'enableVirtualization'
>;

interface UseTreeViewVirtualizationState {
  virtualization: {
    /**
     * The viewport height.
     */
    viewportHeight: number;
    /**
     * The minimum size to display all the items.
     */
    contentSize: number;
  };
}

export type UseTreeViewVirtualizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewVirtualizationParameters;
  defaultizedParams: UseTreeViewVirtualizationDefaultizedParameters;
  instance: UseTreeViewVirtualizationInstance;
  state: UseTreeViewVirtualizationState;
  dependencies: [];
}>;
