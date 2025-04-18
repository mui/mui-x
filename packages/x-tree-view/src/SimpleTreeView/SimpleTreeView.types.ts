import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils/types';
import { SxProps } from '@mui/system/styleFunctionSx';
import { SimpleTreeViewClasses } from './simpleTreeViewClasses';
import {
  SimpleTreeViewPluginParameters,
  SimpleTreeViewPluginSignatures,
} from './SimpleTreeView.plugins';
import { TreeViewPublicAPI } from '../internals/models';
import {
  TreeViewSlotProps,
  TreeViewSlots,
} from '../internals/TreeViewProvider/TreeViewStyleContext';

export interface SimpleTreeViewSlots extends TreeViewSlots {
  /**
   * Element rendered at the root.
   * @default SimpleTreeViewRoot
   */
  root?: React.ElementType;
}

export interface SimpleTreeViewSlotProps extends TreeViewSlotProps {
  root?: SlotComponentProps<'ul', {}, {}>;
}

export type SimpleTreeViewApiRef = React.RefObject<
  TreeViewPublicAPI<SimpleTreeViewPluginSignatures> | undefined
>;

export interface SimpleTreeViewProps<Multiple extends boolean | undefined>
  extends SimpleTreeViewPluginParameters<Multiple>,
    React.HTMLAttributes<HTMLUListElement> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Overridable component slots.
   */
  slots?: SimpleTreeViewSlots;
  /**
   * The props used for each component slot.
   */
  slotProps?: SimpleTreeViewSlotProps;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<SimpleTreeViewClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef?: SimpleTreeViewApiRef;
}
