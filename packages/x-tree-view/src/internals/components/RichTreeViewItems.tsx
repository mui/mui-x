import * as React from 'react';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeItem2Props } from '../../TreeItem2';
import { TreeViewItemId } from '../../models';
import { TreeViewItemToRenderProps } from '../plugins/useTreeViewItems';

interface RichTreeViewItemsOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewItemsSlots {
  /**
   * Custom component for the item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps> | React.JSXElementConstructor<TreeItem2Props>;
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

function WrappedTreeItem({
  slots,
  slotProps,
  label,
  id,
  itemId,
  children,
}: Pick<RichTreeViewItemsProps, 'slots' | 'slotProps'> &
  Pick<TreeItemProps, 'id' | 'itemId' | 'children'> & { label: string }) {
  const Item = slots?.item ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{children}</Item>;
}

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { itemsToRender, slots, slotProps } = props;

  const renderItem = ({ children, ...other }: TreeViewItemToRenderProps) => {
    return (
      <WrappedTreeItem slots={slots} slotProps={slotProps} key={other.itemId} {...other}>
        {children?.map(renderItem)}
      </WrappedTreeItem>
    );
  };

  return <React.Fragment>{itemsToRender.map(renderItem)}</React.Fragment>;
}
