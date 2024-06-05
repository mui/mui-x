import { TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

export interface UseTreeViewLabelInstance {
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
  updateItemLabel: (itemId: TreeViewItemId, newLabel: string) => void;
}

export interface UseTreeViewLabelParameters<R extends {}> {
  items: readonly R[];
  getItemLabel?: (item: R) => string;
}

export interface UseTreeViewLabelState {
  editedItemId: string | null;
  labels: { [key: TreeViewItemId]: string };
}

export type UseTreeViewLabelSignature = TreeViewPluginSignature<{
  params: UseTreeViewLabelParameters<any>;
  defaultizedParams: UseTreeViewLabelParameters<any>;
  instance: UseTreeViewLabelInstance;
  state: UseTreeViewLabelState;
}>;
