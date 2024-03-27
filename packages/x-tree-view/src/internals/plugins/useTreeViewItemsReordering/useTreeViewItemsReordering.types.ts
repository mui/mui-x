import { DefaultizedProps, TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';

export interface UseTreeViewItemsReorderingInstance {
  canItemBeDragged: (itemId: string) => boolean;
  startDraggingItem: (itemId: string) => void;
  stopDraggingItem: (itemId: string) => void;
  setDragTargetItem: (itemId: string, action: TreeViewItemsReorderingAction) => void;
}

export interface UseTreeViewItemsReorderingParameters {
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
  /**
   * Used to determine if a given item can be reordered.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable?: (itemId: string) => boolean;
}

export type UseTreeViewItemsReorderingDefaultizedParameters = DefaultizedProps<
  UseTreeViewItemsReorderingParameters,
  'itemsReordering'
>;

export interface UseTreeViewItemsReorderingState {
  itemsReordering: {
    draggedItemId: string;
    targetItemId: string;
    action: TreeViewItemsReorderingAction;
  } | null;
}

interface UseTreeViewItemsReorderingContextValue {
  itemsReordering: {
    enabled: boolean;
    currentDrag: UseTreeViewItemsReorderingState['itemsReordering'];
  };
}

export type UseTreeViewItemsReorderingSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsReorderingParameters;
  defaultizedParams: UseTreeViewItemsReorderingDefaultizedParameters;
  instance: UseTreeViewItemsReorderingInstance;
  state: UseTreeViewItemsReorderingState;
  contextValue: UseTreeViewItemsReorderingContextValue;
  dependantPlugins: [UseTreeViewNodesSignature];
}>;

// TODO: Add support for "re-parent to level X"
export type TreeViewItemsReorderingAction = 'reorder-above' | 'reorder-below' | 'make-child';
