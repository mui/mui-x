import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '@mui/x-tree-view/internals';

export interface UseTreeViewVirtualizationInstance {
  getDimensions: () => UseTreeViewVirtualizationState['virtualization'];
}

export interface UseTreeViewVirtualizationParameters {
  enableVirtualization?: boolean;
  /**
   * Region in pixels to render before/after the viewport
   * @default 150
   */
  scrollBufferPx?: number;
  /**
   * Sets the height in pixel of an item.
   * @default 32
   */
  itemsHeight?: number;
}

export type UseTreeViewVirtualizationDefaultizedParameters = DefaultizedProps<
  UseTreeViewVirtualizationParameters,
  'enableVirtualization' | 'scrollBufferPx' | 'itemsHeight'
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

export interface UseTreeViewVirtualizationContextValue {
  virtualization: Pick<
    UseTreeViewVirtualizationDefaultizedParameters,
    'scrollBufferPx' | 'itemsHeight'
  > & {
    virtualScrollerRef: React.RefObject<HTMLDivElement>;
  };
}

export type UseTreeViewVirtualizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewVirtualizationParameters;
  defaultizedParams: UseTreeViewVirtualizationDefaultizedParameters;
  instance: UseTreeViewVirtualizationInstance;
  state: UseTreeViewVirtualizationState;
  contextValue: UseTreeViewVirtualizationContextValue;
  dependencies: [];
}>;
