import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeViewItemToRenderProps } from '../plugins/useTreeViewItems';
import {
  UseTreeViewObjectItemsSlotProps,
  UseTreeViewObjectItemsSlots,
} from '../plugins/useTreeViewObjectItems';

export interface RichTreeViewItemsProps {
  itemsToRender: TreeViewItemToRenderProps[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UseTreeViewObjectItemsSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseTreeViewObjectItemsSlotProps;
}

function WrappedTreeItem({
  slots,
  slotProps,
  label,
  id,
  itemId,
  itemsToRender,
}: Pick<RichTreeViewItemsProps, 'slots' | 'slotProps'> &
  Pick<TreeItemProps, 'id' | 'itemId' | 'children'> & {
    label: string;
    isContentHidden?: boolean;
    itemsToRender: TreeViewItemToRenderProps[] | undefined;
  }) {
  const Item = slots?.item ?? TreeItem;
  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{itemsToRender}</Item>;
}

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { itemsToRender, slots, slotProps } = props;

  return (
    <React.Fragment>
      {itemsToRender.map((item) => (
        <WrappedTreeItem
          slots={slots}
          slotProps={slotProps}
          key={item.itemId}
          label={item.label}
          id={item.id}
          itemId={item.itemId}
          itemsToRender={item.children}
        />
      ))}
    </React.Fragment>
  );
}
