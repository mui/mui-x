import * as React from 'react';
import {
  DefaultizedProps,
  TreeViewPluginSignature,
  UseTreeViewItemsSignature,
  TreeViewItemToRenderProps,
  UseTreeViewExpansionSignature,
  UseTreeViewFocusSignature,
} from '@mui/x-tree-view/internals';
import { UseTreeViewItemsReorderingSignature } from '../useTreeViewItemsReordering';

export interface UseTreeViewVirtualizationInstance {
  getDimensions: () => UseTreeViewVirtualizationState['virtualization'];
  handleResizeRoot: () => void;
  computeRenderContext: (params: {
    scrollPositionPx: number;
    scrollDirection: UseTreeViewVirtualizationScrollDirection;
  }) => UseTreeViewVirtualizationRenderContext;
  getItemsToRenderWithVirtualization: (
    renderContext: UseTreeViewVirtualizationRenderContext,
  ) => TreeViewItemToRenderProps[];
}

export interface UseTreeViewVirtualizationParameters {
  /**
   * Region in pixels to render before/after the viewport.
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
  virtualization: Pick<UseTreeViewVirtualizationDefaultizedParameters, 'itemsHeight'> & {
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

export type UseTreeViewVirtualizationScrollDirection = 'none' | 'up' | 'down' | 'left' | 'right';

export type UseTreeViewVirtualizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewVirtualizationParameters;
  defaultizedParams: UseTreeViewVirtualizationDefaultizedParameters;
  instance: UseTreeViewVirtualizationInstance;
  state: UseTreeViewVirtualizationState;
  contextValue: UseTreeViewVirtualizationContextValue;
  experimentalFeatures: 'virtualization';
  dependencies: [
    UseTreeViewItemsSignature,
    UseTreeViewExpansionSignature,
    UseTreeViewFocusSignature,
  ];
  optionalDependencies: [UseTreeViewItemsReorderingSignature];
}>;
