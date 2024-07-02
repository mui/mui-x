import { TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

export interface UseTreeViewLabelPublicAPI {
  updateItemLabel: (itemId: TreeViewItemId, newLabel: string) => void;
}

export interface UseTreeViewLabelInstance extends UseTreeViewLabelPublicAPI {
  /**
   * Used to set the state.
   * @param {TreeViewItemId} itemId The item that is being currently edited.
   * @returns {void}.
   */
  setEditedItemId: (itemId: TreeViewItemId | null) => void;
  /**
   * Used to determine if an item is currently being edited.
   * @param {TreeViewItemId} itemId The item to check.
   * @returns {void}.
   */
  isItemBeingEdited: (itemId: TreeViewItemId) => boolean;
  /**
   * Used to determine if a given item is editable.
   * @param {TreeViewItemId} itemId The item to check.
   * @returns {boolean} `true` if the item should be editable.
   */
  isItemEditable: (itemId: TreeViewItemId) => boolean;
  /**
   * Used to determine if the tree view is editable.
   * @returns {boolean} `true` if the tree view is editable.
   */
  isTreeViewEditable: boolean;
}

export interface UseTreeViewLabelParameters<R extends {}> {
  items: readonly R[];
  /**
   * Callback fired when the label of an item changes.
   * @param {TreeViewItemId} itemId The id of the item that was edited.
   * @param {string} newLabel The new label of the items.
   */
  onItemLabelChange?: (itemId: TreeViewItemId, newLabel: string) => void;
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
