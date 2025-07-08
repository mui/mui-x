import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import { SlotComponentProps } from '@mui/utils/types';
import {
  TreeViewPublicAPI,
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
  TreeViewSlots,
  TreeViewSlotProps,
} from '@mui/x-tree-view/internals';
import { RichTreeViewProClasses } from './richTreeViewProClasses';
import {
  RichTreeViewProPluginParameters,
  RichTreeViewProPluginSignatures,
} from './RichTreeViewPro.plugins';

export interface RichTreeViewProSlots extends TreeViewSlots, RichTreeViewItemsSlots {
  /**
   * Element rendered at the root.
   * @default RichTreeViewProRoot
   */
  root?: React.ElementType;
}

export interface RichTreeViewProSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps,
    RichTreeViewItemsSlotProps {
  root?: SlotComponentProps<'ul', {}, RichTreeViewProProps<R, Multiple>>;
}

export type RichTreeViewProApiRef = React.RefObject<
  TreeViewPublicAPI<RichTreeViewProPluginSignatures> | undefined
>;

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
  extends RichTreeViewProPluginParameters<R, Multiple>,
    RichTreeViewProPropsBase {
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
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef?: RichTreeViewProApiRef;
}
