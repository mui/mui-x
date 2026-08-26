'use client';
import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useStore } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { useTreeViewRootProps } from '../hooks/useTreeViewRootProps';
import { itemsSelectors } from '../plugins/items';
import { selectionSelectors } from '../plugins/selection';
import { TREE_ITEM_ICON_CONTAINER_WIDTH_PX } from '../constants';
import type { TreeViewAnyStore } from '../models';
import type { TreeViewStoreInContext } from '../TreeViewProvider';

const SKELETON_LABEL_WIDTHS = ['40%', '70%', '55%', '50%', '65%'];
export const DEFAULT_SKELETON_ITEMS_COUNT = 5;
export const MAX_SKELETON_ITEMS_COUNT = 100;

export function getSkeletonItemsCount(loadingItemsCount: number | undefined): number {
  if (process.env.NODE_ENV !== 'production') {
    if (
      loadingItemsCount != null &&
      (!Number.isFinite(loadingItemsCount) || loadingItemsCount < 0)
    ) {
      warnOnce([
        `MUI X: The \`loadingItemsCount\` prop received an invalid value (${loadingItemsCount}).`,
        'It must be a non-negative finite number.',
      ]);
    }
  }

  const rawCount = loadingItemsCount ?? DEFAULT_SKELETON_ITEMS_COUNT;
  return Number.isFinite(rawCount)
    ? Math.max(1, Math.min(MAX_SKELETON_ITEMS_COUNT, Math.floor(rawCount)))
    : DEFAULT_SKELETON_ITEMS_COUNT;
}

export interface RichTreeViewSkeletonSlots {
  /**
   * Element rendered at the root.
   */
  root: React.ElementType;
  /**
   * Component rendered instead of the default skeleton rows while the tree is loading.
   * It renders inside the tree root, which keeps its `role="tree"` and `aria-busy` attributes.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each row of the loading skeleton.
   */
  skeletonItem: React.ElementType;
  /**
   * Component rendered inside each skeleton row, wrapping the icon gutter and the label placeholder.
   */
  skeletonContent: React.ElementType;
}

export interface RichTreeViewSkeletonItemOwnerState {
  /**
   * Index of the skeleton row inside its group.
   */
  index: number;
  /**
   * Number of skeleton rows rendered in the group.
   */
  itemsCount: number;
  /**
   * Depth of the skeleton rows.
   */
  itemDepth: number;
  /**
   * Whether each row renders a checkbox placeholder.
   */
  isCheckboxSelectionEnabled: boolean;
}

export interface RichTreeViewSkeletonSlotProps<TOwnerState extends object> {
  root?: SlotComponentProps<'ul', {}, TOwnerState>;
  loading?: SlotComponentProps<'div', Record<string, any>, TOwnerState>;
  skeletonItem?: SlotComponentProps<'li', {}, RichTreeViewSkeletonItemOwnerState>;
  skeletonContent?: SlotComponentProps<'div', {}, RichTreeViewSkeletonItemOwnerState>;
}

export interface RichTreeViewSkeletonClasses {
  root?: string;
  skeletonItem?: string;
  skeletonContent?: string;
}

export interface RichTreeViewSkeletonProps<
  TStore extends TreeViewAnyStore,
  TOwnerState extends object,
> {
  store: TreeViewStoreInContext<TStore>;
  slots: RichTreeViewSkeletonSlots;
  slotProps?: RichTreeViewSkeletonSlotProps<TOwnerState>;
  ownerState: TOwnerState;
  forwardedProps: React.HTMLAttributes<HTMLUListElement>;
  rootRef: React.Ref<HTMLUListElement>;
  classes: RichTreeViewSkeletonClasses;
  loadingItemsCount?: number;
}

export interface RichTreeViewSkeletonItemsProps<TStore extends TreeViewAnyStore> {
  store: TreeViewStoreInContext<TStore>;
  classes: Pick<RichTreeViewSkeletonClasses, 'skeletonItem' | 'skeletonContent'>;
  slots: Pick<RichTreeViewSkeletonSlots, 'skeletonItem' | 'skeletonContent'>;
  slotProps?: Pick<RichTreeViewSkeletonSlotProps<object>, 'skeletonItem' | 'skeletonContent'>;
  itemsCount: number;
  /**
   * The depth of the skeleton rows.
   * Pass the depth of the loading items when the skeleton renders inside a parent item.
   * @default 0
   */
  itemDepth?: number;
}

interface RichTreeViewSkeletonRowProps {
  classes: Pick<RichTreeViewSkeletonClasses, 'skeletonItem' | 'skeletonContent'>;
  slots: Pick<RichTreeViewSkeletonSlots, 'skeletonItem' | 'skeletonContent'>;
  slotProps?: Pick<RichTreeViewSkeletonSlotProps<object>, 'skeletonItem' | 'skeletonContent'>;
  ownerState: RichTreeViewSkeletonItemOwnerState;
  style: React.CSSProperties;
  labelWidth: string;
}

function RichTreeViewSkeletonRow(props: RichTreeViewSkeletonRowProps) {
  const { classes, slots, slotProps, ownerState, style, labelWidth } = props;

  const SkeletonItem = slots.skeletonItem;
  const SkeletonContent = slots.skeletonContent;

  const skeletonItemProps = useSlotProps({
    elementType: SkeletonItem,
    externalSlotProps: slotProps?.skeletonItem,
    className: classes.skeletonItem,
    additionalProps: {
      role: 'treeitem',
      'aria-disabled': true,
      style,
    },
    ownerState,
  });

  const skeletonContentProps = useSlotProps({
    elementType: SkeletonContent,
    externalSlotProps: slotProps?.skeletonContent,
    className: classes.skeletonContent,
    ownerState,
  });

  return (
    <SkeletonItem {...skeletonItemProps}>
      <SkeletonContent {...skeletonContentProps}>
        <span
          style={{
            width: TREE_ITEM_ICON_CONTAINER_WIDTH_PX,
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
        {ownerState.isCheckboxSelectionEnabled && (
          // Same size as the checkbox rendered by the tree item, to keep the labels aligned.
          <Skeleton variant="circular" width={24} height={24} style={{ flexShrink: 0 }} />
        )}
        <Skeleton width={labelWidth} />
      </SkeletonContent>
    </SkeletonItem>
  );
}

/**
 * Renders the skeleton rows without any wrapper.
 * Used by `RichTreeViewSkeleton` for the whole-tree loading state and by
 * `RichTreeViewItem` for the children of an item that lazily loads them.
 */
export function RichTreeViewSkeletonItems<TStore extends TreeViewAnyStore>(
  props: RichTreeViewSkeletonItemsProps<TStore>,
) {
  const { store, classes, slots, slotProps, itemsCount, itemDepth = 0 } = props;

  const itemHeight = useStore(store, itemsSelectors.itemHeight);
  const isCheckboxSelectionEnabled = useStore(store, selectionSelectors.isCheckboxSelectionEnabled);
  const skeletonItemStyle = {
    '--TreeView-itemDepth': itemDepth,
    ...(itemHeight == null ? {} : { '--TreeView-itemHeight': `${itemHeight}px` }),
  } as React.CSSProperties;

  return (
    <React.Fragment>
      {Array.from({ length: itemsCount }, (_, index) => (
        <RichTreeViewSkeletonRow
          key={index}
          classes={classes}
          slots={slots}
          slotProps={slotProps}
          ownerState={{ index, itemsCount, itemDepth, isCheckboxSelectionEnabled }}
          style={skeletonItemStyle}
          labelWidth={SKELETON_LABEL_WIDTHS[index % SKELETON_LABEL_WIDTHS.length]}
        />
      ))}
    </React.Fragment>
  );
}

/**
 * Renders the loading placeholder shared by `RichTreeView` and `RichTreeViewPro`.
 * It reuses `useTreeViewRootProps` so the root element keeps the same `role="tree"`,
 * `id`, `aria-multiselectable` and slot/className behavior as the non-loading tree.
 */
export function RichTreeViewSkeleton<TStore extends TreeViewAnyStore, TOwnerState extends object>(
  props: RichTreeViewSkeletonProps<TStore, TOwnerState>,
) {
  const { store, slots, slotProps, ownerState, forwardedProps, rootRef, classes, loadingItemsCount } =
    props;

  const getRootProps = useTreeViewRootProps(store, forwardedProps, rootRef);
  const skeletonItemsCount = getSkeletonItemsCount(loadingItemsCount);

  const Root = slots.root;
  const Loading = slots.loading;
  const loadingProps = useSlotProps({
    elementType: Loading ?? 'div',
    externalSlotProps: slotProps?.loading,
    ownerState,
  });
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
      {Loading ? (
        <Loading {...loadingProps} />
      ) : (
        <RichTreeViewSkeletonItems
          store={store}
          classes={classes}
          slots={slots}
          slotProps={slotProps}
          itemsCount={skeletonItemsCount}
        />
      )}
    </Root>
  );
}
