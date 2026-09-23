'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useStore } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';
import { TreeItemLoader } from '../../TreeItemLoader';
import type { TreeItemLoaderOwnerState } from '../../TreeItemLoader';
import type { TreeItemLoaderContextValue } from '../../TreeItemLoader/TreeItemLoaderContext';
import { TreeItemLoaderContext } from '../../TreeItemLoader/TreeItemLoaderContext';
import { useTreeViewRootProps } from '../hooks/useTreeViewRootProps';
import { itemsSelectors } from '../plugins/items';
import { selectionSelectors } from '../plugins/selection';
import type { TreeViewAnyStore } from '../models';
import type { TreeViewItemId } from '../../models';
import type { TreeViewStoreInContext } from '../TreeViewProvider';

export const DEFAULT_LOADING_ITEMS_COUNT = 5;
export const MAX_LOADING_ITEMS_COUNT = 100;

export function getLoadingItemsCount(itemsCount: number | undefined): number {
  if (process.env.NODE_ENV !== 'production') {
    if (itemsCount != null && (!Number.isFinite(itemsCount) || itemsCount < 0)) {
      warnOnce([
        `MUI X: The \`itemsCount\` value in \`slotProps.loading\` received an invalid value (${itemsCount}).`,
        'It must be a non-negative finite number.',
      ]);
    }
  }

  const rawCount = itemsCount ?? DEFAULT_LOADING_ITEMS_COUNT;
  return Number.isFinite(rawCount)
    ? Math.max(1, Math.min(MAX_LOADING_ITEMS_COUNT, Math.floor(rawCount)))
    : DEFAULT_LOADING_ITEMS_COUNT;
}

export interface RichTreeViewLoadingSlots {
  /**
   * Element rendered at the root.
   */
  root: React.ElementType;
  /**
   * Component rendered instead of the default loading rows.
   * It renders inside the tree root while the tree is loading and inside a
   * lazily loading item while its children load.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each loading row.
   * @default TreeItemLoader
   */
  itemLoader?: React.ElementType;
}

export interface RichTreeViewLoadingSlotOwnProps {
  /**
   * The number of loading rows to render.
   * The children of a lazily loading item use `getChildrenCount()` as the default instead.
   * @default 5
   */
  itemsCount?: number;
  /**
   * A message describing the loading state.
   * The default loading rows do not render it.
   * It is forwarded to a custom `loading` slot component.
   */
  message?: React.ReactNode;
}

/**
 * The owner state of the `loading` slot.
 */
export interface RichTreeViewLoadingSlotOwnerState {
  /**
   * The id of the item whose children are loading.
   * `null` while the whole tree is loading.
   */
  itemId: TreeViewItemId | null;
}

export interface RichTreeViewLoadingSlotProps<TOwnerState extends object> {
  root?: SlotComponentProps<'ul', {}, TOwnerState>;
  loading?: SlotComponentProps<
    'div',
    RichTreeViewLoadingSlotOwnProps,
    RichTreeViewLoadingSlotOwnerState
  >;
  itemLoader?: SlotComponentProps<'li', {}, TreeItemLoaderOwnerState>;
}

export interface RichTreeViewLoadingClasses {
  root?: string;
  itemLoader?: string;
}

export interface RichTreeViewLoadingProps<
  TStore extends TreeViewAnyStore,
  TOwnerState extends object,
> {
  store: TreeViewStoreInContext<TStore>;
  slots: RichTreeViewLoadingSlots;
  slotProps?: RichTreeViewLoadingSlotProps<TOwnerState>;
  ownerState: TOwnerState;
  forwardedProps: React.HTMLAttributes<HTMLUListElement>;
  rootRef: React.Ref<HTMLUListElement>;
  classes: RichTreeViewLoadingClasses;
}

export interface RichTreeViewItemLoadersProps {
  classes: Pick<RichTreeViewLoadingClasses, 'itemLoader'>;
  slots: Pick<RichTreeViewLoadingSlots, 'itemLoader'>;
  slotProps?: Pick<RichTreeViewLoadingSlotProps<object>, 'itemLoader'>;
  itemsCount: number;
}

interface RichTreeViewItemLoaderRowProps {
  classes: Pick<RichTreeViewLoadingClasses, 'itemLoader'>;
  slots: Pick<RichTreeViewLoadingSlots, 'itemLoader'>;
  slotProps?: Pick<RichTreeViewLoadingSlotProps<object>, 'itemLoader'>;
  ownerState: TreeItemLoaderOwnerState;
}

function RichTreeViewItemLoaderRow(props: RichTreeViewItemLoaderRowProps) {
  const { classes, slots, slotProps, ownerState } = props;

  const ItemLoader = slots.itemLoader ?? TreeItemLoader;

  const itemLoaderProps = useSlotProps({
    elementType: ItemLoader,
    externalSlotProps: slotProps?.itemLoader,
    className: classes.itemLoader,
    additionalProps: {
      role: 'treeitem',
      'aria-disabled': true,
    },
    ownerState,
  });

  return <ItemLoader {...itemLoaderProps} />;
}

/**
 * Renders the default loading rows without any wrapper.
 * Used by `RichTreeViewLoading` for the whole-tree loading state and by
 * `RichTreeViewItem` for the children of an item that lazily loads them.
 * It must render inside a `TreeItemLoaderContext` provider.
 */
export function RichTreeViewItemLoaders(props: RichTreeViewItemLoadersProps) {
  const { classes, slots, slotProps, itemsCount } = props;

  const { itemDepth, isCheckboxSelectionEnabled } = React.useContext(TreeItemLoaderContext);

  return (
    <React.Fragment>
      {Array.from({ length: itemsCount }, (_, index) => (
        <RichTreeViewItemLoaderRow
          key={index}
          classes={classes}
          slots={slots}
          slotProps={slotProps}
          ownerState={{ index, itemsCount, itemDepth, isCheckboxSelectionEnabled }}
        />
      ))}
    </React.Fragment>
  );
}

/**
 * Provides the layout information the loading rows need to `TreeItemLoader`.
 * Wraps both the default rows and a custom `loading` slot, so custom loading
 * UIs composed with `TreeItemLoader` keep the correct depth and height.
 */
export function RichTreeViewLoadingContext<TStore extends TreeViewAnyStore>(props: {
  store: TreeViewStoreInContext<TStore>;
  itemDepth?: number;
  children: React.ReactNode;
}) {
  const { store, itemDepth = 0, children } = props;

  const itemHeight = useStore(store, itemsSelectors.itemHeight);
  const isCheckboxSelectionEnabled = useStore(store, selectionSelectors.isCheckboxSelectionEnabled);
  const contextValue = React.useMemo<TreeItemLoaderContextValue>(
    () => ({ itemDepth, itemHeight, isCheckboxSelectionEnabled }),
    [itemDepth, itemHeight, isCheckboxSelectionEnabled],
  );

  return (
    <TreeItemLoaderContext.Provider value={contextValue}>{children}</TreeItemLoaderContext.Provider>
  );
}

/**
 * Renders the loading placeholder shared by `RichTreeView` and `RichTreeViewPro`.
 * It reuses `useTreeViewRootProps` so the root element keeps the same `role="tree"`,
 * `id`, `aria-multiselectable` and slot/className behavior as the non-loading tree.
 */
export function RichTreeViewLoading<TStore extends TreeViewAnyStore, TOwnerState extends object>(
  props: RichTreeViewLoadingProps<TStore, TOwnerState>,
) {
  const { store, slots, slotProps, ownerState, forwardedProps, rootRef, classes } = props;

  const getRootProps = useTreeViewRootProps(store, forwardedProps, rootRef);

  const Root = slots.root;
  const Loading = slots.loading;
  const loadingProps = useSlotProps({
    elementType: Loading ?? 'div',
    externalSlotProps: slotProps?.loading,
    ownerState: { itemId: null } satisfies RichTreeViewLoadingSlotOwnerState,
  }) as RichTreeViewLoadingSlotOwnProps & Record<string, any>;
  const itemsCount = getLoadingItemsCount(loadingProps.itemsCount);
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    additionalProps: {
      'aria-busy': true,
      // Fallback name only: a label provided by the consumer must win in both loading states.
      ...(forwardedProps['aria-label'] == null && forwardedProps['aria-labelledby'] == null
        ? { 'aria-label': 'Loading' }
        : {}),
    },
    ownerState,
  });

  return (
    <Root {...rootProps}>
      <RichTreeViewLoadingContext store={store}>
        {Loading ? (
          <Loading {...loadingProps} itemsCount={itemsCount} />
        ) : (
          <RichTreeViewItemLoaders
            classes={classes}
            slots={slots}
            slotProps={slotProps}
            itemsCount={itemsCount}
          />
        )}
      </RichTreeViewLoadingContext>
    </Root>
  );
}
