'use client';
import * as React from 'react';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { useStore } from '@mui/x-internals/store';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeViewItemId } from '../../models';
import { itemsSelectors } from '../plugins/items';
import { useTreeViewContext } from '../TreeViewProvider';
import { expansionSelectors } from '../plugins/expansion';
import { RichTreeViewStore } from '../RichTreeViewStore';
import { MinimalTreeViewState } from '../MinimalTreeViewStore';

const RichTreeViewItemsContext = React.createContext<
  ((itemId: TreeViewItemId) => React.ReactNode) | null
>(null);

const selectorNoChildren = () => EMPTY_ARRAY;
const selectorChildrenIdsNull = (state: MinimalTreeViewState<any, any>) =>
  itemsSelectors.itemOrderedChildrenIds(state, null);

const WrappedTreeItem = React.memo(function WrappedTreeItem({
  itemSlot,
  itemSlotProps,
  itemId,
  skipChildren,
}: WrappedTreeItemProps) {
  const renderItemForRichTreeView = React.useContext(RichTreeViewItemsContext)!;
  const { store } = useTreeViewContext<RichTreeViewStore<any, any>>();

  const itemMeta = useStore(store, itemsSelectors.itemMeta, itemId);
  const children = useStore(
    store,
    skipChildren ? selectorNoChildren : itemsSelectors.itemOrderedChildrenIds,
    itemId,
  );
  const Item = (itemSlot ?? TreeItem) as React.JSXElementConstructor<TreeItemProps>;

  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: itemSlotProps,
    additionalProps: { label: itemMeta?.label, id: itemMeta?.idAttribute, itemId },
    ownerState: { itemId, label: itemMeta?.label as string },
  });

  return <Item {...itemProps}>{children?.map(renderItemForRichTreeView)}</Item>;
}, fastObjectShallowCompare);

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { slots, slotProps } = props;
  const { store } = useTreeViewContext<RichTreeViewStore<any, any>>();

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;
  const domStructure = useStore(store, itemsSelectors.domStructure);
  const items = useStore(
    store,
    domStructure === 'flat' ? expansionSelectors.flatList : selectorChildrenIdsNull,
  );

  const skipChildren = domStructure === 'flat';

  const renderItem = React.useCallback(
    (itemId: TreeViewItemId) => {
      return (
        <WrappedTreeItem
          itemSlot={itemSlot}
          itemSlotProps={itemSlotProps}
          key={itemId}
          itemId={itemId}
          skipChildren={skipChildren}
        />
      );
    },
    [itemSlot, itemSlotProps, skipChildren],
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
  skipChildren: boolean;
}
