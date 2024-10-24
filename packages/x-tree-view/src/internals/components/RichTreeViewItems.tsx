import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeViewItemId } from '../../models';
import { TreeViewItemToRenderProps } from '../plugins/useTreeViewItems';
import { RichTreeViewItemsContext } from '../hooks/useRichTreeViewItemsContext';

interface RichTreeViewItemsOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewItemsSlots {
  /**
   * Custom component to render a Tree Item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface RichTreeViewItemsSlotProps {
  item?: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState>;
}

export interface RichTreeViewItemsProps {
  itemsToRender: TreeViewItemToRenderProps[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewItemsSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewItemsSlotProps;
}

interface WrappedTreeItemProps extends Pick<TreeItemProps, 'id' | 'itemId' | 'children'> {
  itemSlot: React.JSXElementConstructor<TreeItemProps> | undefined;
  itemSlotProps: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState> | undefined;
  label: string;
  itemsToRender: TreeViewItemToRenderProps[] | undefined;
}

function WrappedTreeItem({
  itemSlot,
  itemSlotProps,
  label,
  id,
  itemId,
  itemsToRender,
}: WrappedTreeItemProps) {
  const Item = (itemSlot ?? TreeItem) as React.JSXElementConstructor<TreeItemProps>;
  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: itemSlotProps,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{itemsToRender}</Item>;
}

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { itemsToRender, slots, slotProps } = props;

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;

  const renderItem = React.useCallback(
    (item: TreeViewItemToRenderProps) => {
      return (
        <WrappedTreeItem
          itemSlot={itemSlot}
          itemSlotProps={itemSlotProps}
          key={item.itemId}
          label={item.label}
          id={item.id}
          itemId={item.itemId}
          itemsToRender={item.children}
        />
      );
    },
    [itemSlot, itemSlotProps],
  );

  return (
    <RichTreeViewItemsContext.Provider value={renderItem}>
      {itemsToRender.map(renderItem)}
    </RichTreeViewItemsContext.Provider>
  );
}
