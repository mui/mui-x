import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import { RichTreeViewClasses } from './richTreeViewClasses';
import {
  RichTreeViewItemsSlotProps,
  RichTreeViewItemsSlots,
} from '../internals/components/RichTreeViewItems';
import {
  TreeViewSlotProps,
  TreeViewSlots,
} from '../internals/TreeViewProvider/TreeViewStyleContext';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';
import { TreeViewValidItem } from '../models/items';
import { UseTreeViewStoreParameters } from '../internals/hooks/useTreeViewStore';
import { TreeViewPublicAPI } from '../internals/models';

export interface RichTreeViewSlots extends TreeViewSlots, Omit<RichTreeViewItemsSlots, 'root'> {
  /**
   * Element rendered at the root.
   * @default RichTreeViewRoot
   */
  root?: React.ElementType;
}

export interface RichTreeViewSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProps<R, Multiple>> {}

export type RichTreeViewApiRef<
  R extends TreeViewValidItem<R> = any,
  Multiple extends boolean | undefined = any,
> = React.RefObject<Partial<TreeViewPublicAPI<RichTreeViewStore<R, Multiple>>> | undefined>;

export interface RichTreeViewPropsBase extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RichTreeViewClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export interface RichTreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends UseTreeViewStoreParameters<RichTreeViewStore<R, Multiple>>, RichTreeViewPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewSlotProps<R, Multiple>;
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useRichTreeViewApiRef()`.
   */
  apiRef?: RichTreeViewApiRef;
}
