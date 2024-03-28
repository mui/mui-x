import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

export interface UseTreeViewItemsReorderingInstance {
  canItemBeDragged: (itemId: string) => boolean;
  getItemTargetValidActions: (itemId: string) => Record<TreeViewItemsReorderingAction, boolean>;
  startDraggingItem: (itemId: string) => void;
  stopDraggingItem: (itemId: string) => void;
  setDragTargetItem: (itemId: string, action: TreeViewItemsReorderingAction | null) => void;
}

export interface TreeViewItemReorderPosition {
  parentId: string | null;
  index: number;
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
  /**
   * Used to determine if a given item can move to some new position.
   * @param {object} params The params describing the item re-ordering.
   * @param {string} params.itemId The id of the item to check.
   * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
   * @returns {boolean} `true` if the item can move to the new position.
   */
  canMoveItemToNewPosition?: (params: {
    itemId: string;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => boolean;
}

export type UseTreeViewItemsReorderingDefaultizedParameters = DefaultizedProps<
  UseTreeViewItemsReorderingParameters,
  'itemsReordering'
>;

export interface UseTreeViewItemsReorderingState {
  itemsReordering: {
    draggedItemId: string;
    targetItemId: string;
    action: TreeViewItemsReorderingAction | null;
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
  dependantPlugins: [UseTreeViewItemsSignature];
}>;

export type TreeViewItemsReorderingAction =
  | 'reorder-above'
  | 'reorder-below'
  | 'make-child'
  | 'move-to-parent';
