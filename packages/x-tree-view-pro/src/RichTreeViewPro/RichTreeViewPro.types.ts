import type * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { SlotComponentProps } from '@mui/utils/types';
import type { TreeViewValidItem } from '@mui/x-tree-view/models';
import type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
  RichTreeViewSkeletonItemOwnerState,
  TreeViewSlots,
  TreeViewSlotProps,
  UseTreeViewStoreParameters,
  TreeViewPublicAPI,
} from '@mui/x-tree-view/internals';
import type { RichTreeViewProClasses } from './richTreeViewProClasses';
import type { RichTreeViewProStore } from '../internals/RichTreeViewProStore';

export interface RichTreeViewProSlots extends TreeViewSlots, Omit<RichTreeViewItemsSlots, 'root'> {
  /**
   * Element rendered at the root.
   * @default RichTreeViewProRoot
   */
  root?: React.ElementType;
  /**
   * Component rendered instead of the default skeleton rows while the tree is loading.
   * It renders inside the tree root, which keeps its `role="tree"` and `aria-busy` attributes.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each row of the loading skeleton.
   * It also renders for the children of an item while they load lazily.
   * @default RichTreeViewProSkeletonItem
   */
  skeletonItem?: React.ElementType;
  /**
   * Component rendered inside each skeleton row, wrapping the placeholders.
   * @default RichTreeViewProSkeletonContent
   */
  skeletonContent?: React.ElementType;
}

export interface RichTreeViewProSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProProps<R, Multiple>> {
  loading?: SlotComponentProps<'div', Record<string, any>, RichTreeViewProProps<R, Multiple>>;
  skeletonItem?: SlotComponentProps<'li', {}, RichTreeViewSkeletonItemOwnerState>;
  skeletonContent?: SlotComponentProps<'div', {}, RichTreeViewSkeletonItemOwnerState>;
}

export type RichTreeViewProApiRef<
  R extends TreeViewValidItem<R> = any,
  Multiple extends boolean | undefined = any,
> = React.RefObject<Partial<TreeViewPublicAPI<RichTreeViewProStore<R, Multiple>>> | undefined>;

export interface RichTreeViewProPropsBase extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RichTreeViewProClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * If `true`, a skeleton loading UI is displayed instead of the tree items.
   * The skeleton is also shown automatically while `dataSource` is fetching root items.
   * Setting `loading={false}` does not suppress the skeleton during an active `dataSource` root fetch.
   * @default false
   */
  loading?: boolean;
  /**
   * The number of skeleton items to display when `loading` is `true` or while `dataSource` fetches root items.
   * @default 5
   */
  loadingItemsCount?: number;
}

export interface RichTreeViewProProps<R extends {}, Multiple extends boolean | undefined>
  extends UseTreeViewStoreParameters<RichTreeViewProStore<R, Multiple>>, RichTreeViewProPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewProSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewProSlotProps<R, Multiple>;
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useRichTreeViewApiProRef()`.
   */
  apiRef?: RichTreeViewProApiRef;
}
