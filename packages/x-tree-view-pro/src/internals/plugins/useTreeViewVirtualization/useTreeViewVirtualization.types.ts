import * as React from 'react';
import {
  DefaultizedProps,
  TreeViewPluginSignature,
  UseTreeViewItemsSignature,
  TreeViewItemToRenderProps,
} from '@mui/x-tree-view/internals';

export interface UseTreeViewVirtualizationInstance {
  getDimensions: () => UseTreeViewVirtualizationState['virtualization'];
  handleResizeRoot: () => void;
  computeRenderContext: (scrollPositionPx: number) => UseTreeViewVirtualizationRenderContext;
  getItemsToRenderWithVirtualization: (
    renderContext: UseTreeViewVirtualizationRenderContext,
  ) => TreeViewItemToRenderProps[];
}

export interface UseTreeViewVirtualizationParameters {
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
  /**
   * The millisecond throttle delay for resizing the Tree View when virtualization is enabled.
   * @default 60
   */
  resizeThrottleMs?: number;
}

export type UseTreeViewVirtualizationDefaultizedParameters = DefaultizedProps<
  UseTreeViewVirtualizationParameters,
  'scrollBufferPx' | 'itemsHeight' | 'resizeThrottleMs'
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
    enabled: boolean;
    virtualScrollerRef: React.RefObject<HTMLDivElement>;
  };
}

export interface UseTreeViewVirtualizationRenderContext {
  firstItemIndex: number;
  lastItemIndex: number;
}

/**
 * The size of a container.
 */
export interface UseTreeViewVirtualizationElementSize {
  /**
   * The height of a container or HTMLElement.
   */
  height: number;
  /**
   * The width of a container or HTMLElement.
   */
  width: number;
}

export type UseTreeViewVirtualizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewVirtualizationParameters;
  defaultizedParams: UseTreeViewVirtualizationDefaultizedParameters;
  instance: UseTreeViewVirtualizationInstance;
  state: UseTreeViewVirtualizationState;
  contextValue: UseTreeViewVirtualizationContextValue;
  experimentalFeatures: 'virtualization';
  dependencies: [UseTreeViewItemsSignature];
}>;
