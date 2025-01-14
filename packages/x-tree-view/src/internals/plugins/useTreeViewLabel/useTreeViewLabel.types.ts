import { DefaultizedProps } from '@mui/x-internals/types';
import { TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { TreeItemLabelInputProps } from '../../../TreeItemLabelInput';

export interface UseTreeViewLabelPublicAPI {
  /**
   * Used to update the label of an item.
   * @param {TreeViewItemId} itemId The id of the item to update the label of.
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
   * Make sure to also enable the `labelEditing` experimental feature:
   * `<RichTreeViewPro experimentalFeatures={{ labelEditing: true }}  />`.
   * By default, the items are not editable.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item is editable.
   */
  isItemEditable?: boolean | ((item: R) => boolean);
}

export type UseTreeViewLabelDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewLabelParameters<R>,
  'isItemEditable'
>;

export interface UseTreeViewLabelState {
  label: {
    editedItemId: string | null;
  };
}

export interface UseTreeViewLabelContextValue {
  label: Pick<UseTreeViewLabelDefaultizedParameters<any>, 'isItemEditable'>;
}

export type UseTreeViewLabelSignature = TreeViewPluginSignature<{
  params: UseTreeViewLabelParameters<any>;
  defaultizedParams: UseTreeViewLabelDefaultizedParameters<any>;
  publicAPI: UseTreeViewLabelPublicAPI;
  instance: UseTreeViewLabelInstance;
  state: UseTreeViewLabelState;
  contextValue: UseTreeViewLabelContextValue;
  experimentalFeatures: 'labelEditing';
  dependencies: [UseTreeViewItemsSignature];
}>;

export interface UseTreeItemLabelInputSlotPropsFromLabelEditing extends TreeItemLabelInputProps {}

declare module '@mui/x-tree-view/useTreeItem' {
  interface UseTreeItemLabelInputSlotOwnProps
    extends UseTreeItemLabelInputSlotPropsFromLabelEditing {}
}
