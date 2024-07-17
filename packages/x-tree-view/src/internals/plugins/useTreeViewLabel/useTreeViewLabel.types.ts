import { TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

export interface UseTreeViewLabelPublicAPI {
  /**
   * Used to update the label of an item.
   * @param {TreeViewItemId} itemId The id of the item that is being edited.
   * @param {string} newLabel The new label of the item.
   */
  updateItemLabel: (itemId: TreeViewItemId, newLabel: string) => void;
}

export interface UseTreeViewLabelInstance extends UseTreeViewLabelPublicAPI {
  /**
   * Updates which item is currently being edited.
   * @param {TreeViewItemId} itemId The id of the item that is currently being edited.
   * @returns {void}.
   */
  setEditedItemId: (itemId: TreeViewItemId | null) => void;
  /**
   * Checks if an item is being edited or not.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {void}.
   */
  isItemBeingEdited: (itemId: TreeViewItemId) => boolean;
  /**
   * Determines if a given item is editable.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is editable.
   */
  isItemEditable: (itemId: TreeViewItemId) => boolean;
  /**
   * Set to `true` if the tree view is editable.
   */
  isTreeViewEditable: boolean;
}

export interface UseTreeViewLabelParameters<R extends {}> {
  /**
   * Callback fired when the label of an item changes.
   * @param {TreeViewItemId} itemId The id of the item that was edited.
   * @param {string} newLabel The new label of the items.
   */
  onItemLabelChange?: (itemId: TreeViewItemId, newLabel: string) => void;
  /**
   * Determines if a given item is editable or not.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item is editable.
   */
  isItemEditable?: (item: R) => boolean;
}

export interface UseTreeViewLabelState {
  editedItemId: string | null;
}

export type UseTreeViewLabelSignature = TreeViewPluginSignature<{
  params: UseTreeViewLabelParameters<any>;
  defaultizedParams: UseTreeViewLabelParameters<any>;
  publicAPI: UseTreeViewLabelPublicAPI;
  instance: UseTreeViewLabelInstance;
  state: UseTreeViewLabelState;
  dependencies: [UseTreeViewItemsSignature];
}>;
