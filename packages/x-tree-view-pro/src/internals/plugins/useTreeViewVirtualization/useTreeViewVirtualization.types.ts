import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '@mui/x-tree-view/internals';

export interface UseTreeViewVirtualizationInstance {
  virtualScrollerRef: React.RefObject<HTMLUListElement>;
}

export interface UseTreeViewVirtualizationParameters {
  enableVirtualization?: boolean;
}

export type UseTreeViewVirtualizationDefaultizedParameters = DefaultizedProps<
  UseTreeViewVirtualizationParameters,
  'enableVirtualization'
>;

export type UseTreeViewVirtualizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewVirtualizationParameters;
  defaultizedParams: UseTreeViewVirtualizationDefaultizedParameters;
  instance: UseTreeViewVirtualizationInstance;
  dependencies: [];
}>;
