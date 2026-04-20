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
import { useTreeViewContext, useTreeViewStyleContext } from '../TreeViewProvider';
import { expansionSelectors } from '../plugins/expansion';
import { RichTreeViewStore } from '../RichTreeViewStore';
import { MinimalTreeViewState } from '../MinimalTreeViewStore';
import { useTreeViewRootProps } from '../hooks/useTreeViewRootProps';

const RichTreeViewItemsContext = React.createContext<
  ((itemId: TreeViewItemId) => React.ReactNode) | null
>(null);

const selectorNoChildren = () => EMPTY_ARRAY;
const selectorChildrenIdsNull = (state: MinimalTreeViewState<any, any>) =>
  itemsSelectors.itemOrderedChildrenIds(state, null);

export const RichTreeViewItem = React.memo(function RichTreeViewItem({
  itemSlot,
  itemSlotProps,
  itemId,
  skipChildren,
}: RichTreeViewItemProps) {
  const renderItemForRichTreeView = React.useContext(RichTreeViewItemsContext);
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

  return (
    <Item {...itemProps}>
      {renderItemForRichTreeView ? children?.map(renderItemForRichTreeView) : null}
    </Item>
  );
}, fastObjectShallowCompare);

export function RichTreeViewItems<TProps extends object>(props: RichTreeViewItemsProps<TProps>) {
  const { slots, slotProps, ownerState, forwardedProps, rootRef } = props;
  const { store } = useTreeViewContext<RichTreeViewStore<any, any>>();
  const { classes } = useTreeViewStyleContext();

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;
  const domStructure = useStore(store, itemsSelectors.domStructure);
  const items = useStore(
    store,
    domStructure === 'flat' ? expansionSelectors.flatList : selectorChildrenIdsNull,
  );

  const getRootProps = useTreeViewRootProps(store, forwardedProps, rootRef);

  const Root = slots.root;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState,
  });

  const skipChildren = domStructure === 'flat';

  const renderItem = React.useCallback(
    (itemId: TreeViewItemId) => {
      return (
        <RichTreeViewItem
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
      <Root {...rootProps}>{items.map(renderItem)}</Root>
    </RichTreeViewItemsContext.Provider>
  );
}

interface RichTreeViewItemsOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewItemsSlots {
  /**
   * Element rendered at the root.
   * @default RichTreeViewProRoot
   */
  root: React.ElementType;
  /**
   * Custom component to render a Tree Item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface RichTreeViewItemsSlotProps<TProps extends object> {
  item?: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState>;
  root?: SlotComponentProps<'ul', {}, TProps>;
}

export interface RichTreeViewItemsProps<TProps extends object> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: RichTreeViewItemsSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewItemsSlotProps<TProps>;
  /**
   * Owner state applied to the root slot component.
   */
  ownerState: TProps;
  /**
   * Props provided to the component and applied to the root element.
   */
  forwardedProps: React.HTMLAttributes<HTMLUListElement>;
  /**
   * Ref forwarded to the root element.
   */
  rootRef: React.Ref<HTMLUListElement>;
}

interface RichTreeViewItemProps extends Pick<TreeItemProps, 'id' | 'itemId' | 'children'> {
  itemSlot: React.JSXElementConstructor<TreeItemProps> | undefined;
  itemSlotProps: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState> | undefined;
  skipChildren: boolean;
}
