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

const RichTreeViewItemsContext = React.createContext<
  ((item: TreeViewItemToRenderProps) => React.ReactNode) | null
>(null);

if (process.env.NODE_ENV !== 'production') {
  RichTreeViewItemsContext.displayName = 'RichTreeViewItemsProvider';
}

export const useRichTreeViewItemsContext = () => React.useContext(RichTreeViewItemsContext);

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

  const renderItem = React.useCallback(
    (item: TreeViewItemToRenderProps) => {
      return (
        <WrappedTreeItem
          slots={slots}
          slotProps={slotProps}
          key={item.itemId}
          label={item.label}
          id={item.id}
          itemId={item.itemId}
          itemsToRender={item.children}
        />
      );
    },
    [slots, slotProps],
  );

  return (
    <RichTreeViewItemsContext.Provider value={renderItem}>
      {itemsToRender.map(renderItem)}
    </RichTreeViewItemsContext.Provider>
  );
}
