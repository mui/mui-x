import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { SxProps } from '@mui/system';
import { SimpleTreeViewClasses } from './simpleTreeViewClasses';
import {
  SimpleTreeViewPluginParameters,
  SimpleTreeViewPluginSlotProps,
  SimpleTreeViewPluginSlots,
} from './SimpleTreeView.plugins';

export interface SimpleTreeViewSlots extends SimpleTreeViewPluginSlots {
  /**
   * Element rendered at the root.
   * @default SimpleTreeViewRoot
   */
  root?: React.ElementType;
}

export interface SimpleTreeViewSlotProps extends SimpleTreeViewPluginSlotProps {
  root?: SlotComponentProps<'ul', {}, {}>;
}

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
}
