import type * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { TreeViewValidItem } from '@mui/x-tree-view/models';
import type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
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
}

export interface RichTreeViewProSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProProps<R, Multiple>> {}

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
