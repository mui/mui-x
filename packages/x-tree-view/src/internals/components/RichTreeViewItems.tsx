import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils';
import { TreeItem, TreeItemProps } from '../../TreeItem';
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

  const children = React.useMemo(
    () =>
      itemsToRender ? (
        <RichTreeViewItems itemsToRender={itemsToRender} slots={slots} slotProps={slotProps} />
      ) : null,
    [itemsToRender, slots, slotProps],
  );

  return <Item {...itemProps}>{children}</Item>;
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
