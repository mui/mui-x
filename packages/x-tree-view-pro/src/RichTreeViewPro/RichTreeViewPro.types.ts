import type * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { SlotComponentProps } from '@mui/utils/types';
import type { TreeViewValidItem } from '@mui/x-tree-view/models';
import type { TreeItemLoaderOwnerState } from '@mui/x-tree-view/TreeItemLoader';
import type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
  RichTreeViewLoadingSlotOwnProps,
  RichTreeViewLoadingSlotOwnerState,
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
   * Component rendered instead of the default loading rows.
   * It renders inside the tree root while the tree is loading, which keeps the
   * `role="tree"` and `aria-busy` attributes, and inside a lazily loading item
   * while its children load.
   * Compose it with `TreeItemLoader` to keep the rows semantically correct.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each loading row.
   * It also renders for the children of an item while they load lazily.
   * Wrap custom content in `TreeItemLoader` to keep the row semantically correct.
   * @default TreeItemLoader
   */
  itemLoader?: React.ElementType;
}

export interface RichTreeViewProSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProProps<R, Multiple>> {
  loading?: SlotComponentProps<
    'div',
    RichTreeViewLoadingSlotOwnProps,
    RichTreeViewLoadingSlotOwnerState
  >;
  itemLoader?: SlotComponentProps<'li', {}, TreeItemLoaderOwnerState>;
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
   * If `true`, a loading UI is displayed instead of the tree items.
   * The loading UI is also shown automatically while `dataSource` is fetching root items.
   * Setting `loading={false}` does not suppress the loading UI during an active `dataSource` root fetch.
   * @default false
   */
  loading?: boolean;
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
