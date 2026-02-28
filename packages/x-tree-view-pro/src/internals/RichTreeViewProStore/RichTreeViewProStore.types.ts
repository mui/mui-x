import { RichTreeViewStoreParameters, RichTreeViewState } from '@mui/x-tree-view/internals';
import {
  TreeViewDOMStructure,
  TreeViewItemId,
  TreeViewItemsReorderingAction,
  TreeViewValidItem,
} from '@mui/x-tree-view/models';
import { DataSourceCache } from '@mui/x-tree-view/utils';
import { TreeViewItemReorderPosition } from '../plugins/itemsReordering';
import { DataSource } from '../plugins/lazyLoading';

export interface RichTreeViewProState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewState<R, Multiple> {
  /**
   * Determine if a given item can be reordered.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   */
  isItemReorderable: (itemId: TreeViewItemId) => boolean;
  /**
   * The current ongoing reordering operation.
   */
  currentReorder: {
    draggedItemId: TreeViewItemId;
    targetItemId: TreeViewItemId;
    newPosition: TreeViewItemReorderPosition | null;
    action: TreeViewItemsReorderingAction | null;
  } | null;
  /**
   * * Whether virtualization is enabled.
   */
  virtualization: boolean;
}

export interface RichTreeViewProStoreParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewStoreParameters<R, Multiple> {
  /**
   * The data source object.
   */
  dataSource?: DataSource<R>;
  /**
   * The data source cache object.
   */
  dataSourceCache?: DataSourceCache;
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
  /**
   * Determine if a given item can be reordered.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable?: (itemId: TreeViewItemId) => boolean;
  /**
   * Used to determine if a given item can move to some new position.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {TreeViewItemId} parameters.itemId The id of the item that is being moved to a new position.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   * @returns {boolean} `true` if the item can move to the new position.
   */
  canMoveItemToNewPosition?: (parameters: {
    itemId: TreeViewItemId;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => boolean;
  /**
   * Callback fired when a Tree Item is moved in the tree.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {TreeViewItemId} parameters.itemId The id of the item moved.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   */
  onItemPositionChange?: (parameters: {
    itemId: TreeViewItemId;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => void;
  /**
   * When equal to 'flat', the tree is rendered as a flat list (children are rendered as siblings of their parents).
   * When equal to 'nested', the tree is rendered with nested children (children are rendered inside the groupTransition slot of their children).
   * Nested DOM structure is not compatible with collapse / expansion animations.
   * @default 'flat' when using virtualization, 'nested' otherwise
   */
  domStructure?: TreeViewDOMStructure;
  /**
   * Whether virtualization is enabled.
   * If true, the DOM structure will be set to 'flat'.
   * If true and no itemHeight is provided, a default item height of 32px will be used for calculating the virtualization.
   * @default false
   */
  virtualization?: boolean;
}
