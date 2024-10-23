import { TreeViewItemId } from '../../../models';
import { TreeItemProps } from '../../../TreeItem';
import { SlotComponentPropsFromProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

interface TreeViewItemOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface UseTreeViewObjectItemsParameters {}

export type UseTreeViewObjectItemsDefaultizedParameters = UseTreeViewObjectItemsParameters;

export interface UseTreeViewObjectItemsSlots {
  /**
   * Custom component to render a Tree Item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface UseTreeViewObjectItemsSlotProps {
  item?: SlotComponentPropsFromProps<TreeItemProps, {}, TreeViewItemOwnerState>;
}

export interface UseTreeViewObjectItemsContextValue {
  objectItems: {
    slot: UseTreeViewObjectItemsSlots['item'];
    slotProps: UseTreeViewObjectItemsSlotProps['item'];
  };
}

export type UseTreeViewObjectItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewObjectItemsParameters;
  defaultizedParams: UseTreeViewObjectItemsDefaultizedParameters;
  slots: UseTreeViewObjectItemsSlots;
  slotProps: UseTreeViewObjectItemsSlotProps;
  contextValue: UseTreeViewObjectItemsContextValue;
  dependencies: [UseTreeViewItemsSignature, UseTreeViewKeyboardNavigationSignature];
}>;
