'use client';
import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useStore } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { useTreeViewRootProps } from '../hooks/useTreeViewRootProps';
import { itemsSelectors } from '../plugins/items';
import type { TreeViewAnyStore } from '../models';
import type { TreeViewStoreInContext } from '../TreeViewProvider';

const SKELETON_LABEL_WIDTHS = ['40%', '70%', '55%', '50%', '65%'];
const DEFAULT_SKELETON_ITEMS_COUNT = 5;
const MAX_SKELETON_ITEMS_COUNT = 100;

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
    ? Math.max(0, Math.min(MAX_SKELETON_ITEMS_COUNT, Math.floor(rawCount)))
    : DEFAULT_SKELETON_ITEMS_COUNT;
}

export interface RichTreeViewSkeletonSlots {
  /**
   * Element rendered at the root.
   */
  root: React.ElementType;
}

export interface RichTreeViewSkeletonSlotProps<TOwnerState extends object> {
  root?: SlotComponentProps<'ul', {}, TOwnerState>;
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
  /**
   * Component rendered for each skeleton row.
   */
  SkeletonItemComponent: React.ElementType;
  /**
   * Component rendered inside each skeleton row, wrapping the icon gutter and the label placeholder.
   */
  SkeletonContentComponent: React.ElementType;
}

/**
 * Renders the loading placeholder shared by `RichTreeView` and `RichTreeViewPro`.
 * It reuses `useTreeViewRootProps` so the root element keeps the same `role="tree"`,
 * `id`, `aria-multiselectable` and slot/className behavior as the non-loading tree.
 */
export function RichTreeViewSkeleton<TStore extends TreeViewAnyStore, TOwnerState extends object>(
  props: RichTreeViewSkeletonProps<TStore, TOwnerState>,
) {
  const {
    store,
    slots,
    slotProps,
    ownerState,
    forwardedProps,
    rootRef,
    classes,
    loadingItemsCount,
    SkeletonItemComponent,
    SkeletonContentComponent,
  } = props;

  const getRootProps = useTreeViewRootProps(store, forwardedProps, rootRef);
  const skeletonItemsCount = getSkeletonItemsCount(loadingItemsCount);
  const itemHeight = useStore(store, itemsSelectors.itemHeight);
  const skeletonItemStyle =
    itemHeight == null
      ? undefined
      : ({ '--TreeView-itemHeight': `${itemHeight}px` } as React.CSSProperties);

  const Root = slots.root;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    additionalProps: {
      'aria-busy': true,
      'aria-label': 'Loading',
    },
    ownerState,
  });

  return (
    <Root {...rootProps}>
      {Array.from({ length: skeletonItemsCount }, (_, index) => (
        <SkeletonItemComponent
          key={index}
          role="treeitem"
          aria-disabled
          className={classes.skeletonItem}
          style={skeletonItemStyle}
        >
          <SkeletonContentComponent className={classes.skeletonContent}>
            <span style={{ width: 16, flexShrink: 0, display: 'inline-block' }} />
            <Skeleton width={SKELETON_LABEL_WIDTHS[index % SKELETON_LABEL_WIDTHS.length]} />
          </SkeletonContentComponent>
        </SkeletonItemComponent>
      ))}
    </Root>
  );
}
