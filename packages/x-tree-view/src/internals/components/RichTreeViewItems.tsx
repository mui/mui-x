'use client';
import * as React from 'react';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { useStore } from '@base-ui/utils/store';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { TreeItemProps } from '../../TreeItem';
import { TreeItem } from '../../TreeItem';
import type { TreeViewItemId } from '../../models';
import { itemsSelectors } from '../plugins/items';
import { useTreeViewContext, useTreeViewStyleContext } from '../TreeViewProvider';
import { expansionSelectors } from '../plugins/expansion';
import { lazyLoadingSelectors } from '../plugins/lazyLoading';
import {
  RichTreeViewItemLoaders,
  RichTreeViewLoadingContext,
  getLoadingItemsCount,
  MAX_LOADING_ITEMS_COUNT,
} from './RichTreeViewLoading';
import type {
  RichTreeViewLoadingSlotOwnProps,
  RichTreeViewLoadingSlotOwnerState,
} from './RichTreeViewLoading';
import type { RichTreeViewStore } from '../RichTreeViewStore';
import type { MinimalTreeViewState } from '../MinimalTreeViewStore';
import { useTreeViewRootProps } from '../hooks/useTreeViewRootProps';

const RichTreeViewItemsContext = React.createContext<
  ((itemId: TreeViewItemId) => React.ReactNode) | null
>(null);

const selectorNoChildren = () => EMPTY_ARRAY;
const selectorChildrenIdsNull = (state: MinimalTreeViewState<any, any>) =>
  itemsSelectors.itemOrderedChildrenIds(state, null);

/**
 * Renders the loading rows for the children of an item that lazily loads them.
 * It only mounts while the item is loading, so the `loading` slot props are not
 * resolved for the other items.
 */
function RichTreeViewItemLoadingChildren({ itemId }: { itemId: TreeViewItemId }) {
  const { store } = useTreeViewContext<RichTreeViewStore<any, any>>();
  const { classes, slots: styleSlots, slotProps: styleSlotProps } = useTreeViewStyleContext();

  const itemDepth = useStore(store, itemsSelectors.itemDepth, itemId);
  const loadingChildrenCount = useStore(
    store,
    lazyLoadingSelectors.itemLoadingChildrenCount,
    itemId,
  );

  const Loading = styleSlots.loading;
  const loadingProps = useSlotProps({
    elementType: Loading ?? 'div',
    externalSlotProps: styleSlotProps.loading,
    ownerState: { itemId } satisfies RichTreeViewLoadingSlotOwnerState,
  }) as RichTreeViewLoadingSlotOwnProps & Record<string, any>;

  // The count reported by `getChildrenCount()` wins over `slotProps.loading.itemsCount`,
  // which only acts as a fallback when the count is unknown.
  const itemsCount =
    loadingChildrenCount > 0
      ? Math.min(loadingChildrenCount, MAX_LOADING_ITEMS_COUNT)
      : getLoadingItemsCount(loadingProps.itemsCount);

  return (
    <RichTreeViewLoadingContext store={store} itemDepth={itemDepth + 1}>
      {Loading ? (
        <Loading {...loadingProps} itemsCount={itemsCount} />
      ) : (
        <RichTreeViewItemLoaders
          classes={classes}
          slots={{ itemLoader: styleSlots.itemLoader }}
          slotProps={{ itemLoader: styleSlotProps.itemLoader }}
          itemsCount={itemsCount}
        />
      )}
    </RichTreeViewLoadingContext>
  );
}

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
  const isLoadingChildren = useStore(store, lazyLoadingSelectors.isItemLoading, itemId);
  const Item = (itemSlot ?? TreeItem) as React.JSXElementConstructor<TreeItemProps>;

  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: itemSlotProps,
    additionalProps: { label: itemMeta?.label, id: itemMeta?.idAttribute, itemId },
    ownerState: { itemId, label: itemMeta?.label as string },
  });

  let renderedChildren: React.ReactNode = renderItemForRichTreeView
    ? children?.map(renderItemForRichTreeView)
    : null;

  if (isLoadingChildren && !skipChildren && (children == null || children.length === 0)) {
    renderedChildren = <RichTreeViewItemLoadingChildren itemId={itemId} />;
  }

  return <Item {...itemProps}>{renderedChildren}</Item>;
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
