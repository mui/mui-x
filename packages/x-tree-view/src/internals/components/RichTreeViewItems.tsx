import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeViewItemId } from '../../models';
import { useSelector } from '../hooks/useSelector';
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from '../plugins/useTreeViewItems/useTreeViewItems.selectors';
import { useTreeViewContext } from '../TreeViewProvider';

const RichTreeViewItemsContext = React.createContext<
  ((itemId: TreeViewItemId) => React.ReactNode) | null
>(null);

if (process.env.NODE_ENV !== 'production') {
  RichTreeViewItemsContext.displayName = 'RichTreeViewItemsProvider';
}

const WrappedTreeItem = React.memo(function WrappedTreeItem({
  itemSlot,
  itemSlotProps,
  itemId,
}: WrappedTreeItemProps) {
  const renderItemForRichTreeView = React.useContext(RichTreeViewItemsContext)!;
  const { store } = useTreeViewContext();

  const itemMeta = useSelector(store, selectorItemMeta, itemId);
  const children = useSelector(store, selectorItemOrderedChildrenIds, itemId);
  const Item = (itemSlot ?? TreeItem) as React.JSXElementConstructor<TreeItemProps>;

  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: itemSlotProps,
    additionalProps: { label: itemMeta?.label!, id: itemMeta?.idAttribute!, itemId },
    ownerState: { itemId, label: itemMeta?.label! },
  });

  return <Item {...itemProps}>{children?.map(renderItemForRichTreeView)}</Item>;
}, fastObjectShallowCompare);

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { slots, slotProps } = props;
  const { store } = useTreeViewContext();

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;
  const items = useSelector(store, selectorItemOrderedChildrenIds, null);

  const renderItem = React.useCallback(
    (itemId: TreeViewItemId) => {
      return (
        <WrappedTreeItem
          itemSlot={itemSlot}
          itemSlotProps={itemSlotProps}
          key={itemId}
          itemId={itemId}
        />
      );
    },
    [itemSlot, itemSlotProps],
  );

  return (
    <RichTreeViewItemsContext.Provider value={renderItem}>
      {items.map(renderItem)}
    </RichTreeViewItemsContext.Provider>
  );
}

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
}
