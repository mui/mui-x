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
}

export interface UseTreeViewLabelParameters {
  label?: string;
}

export interface UseTreeViewLabelState {
  editedItemId: string | null;
}

export type UseTreeViewLabelSignature = TreeViewPluginSignature<{
  params: UseTreeViewLabelParameters;
  defaultizedParams: UseTreeViewLabelParameters;
  instance: UseTreeViewLabelInstance;
  state: UseTreeViewLabelState;
}>;
