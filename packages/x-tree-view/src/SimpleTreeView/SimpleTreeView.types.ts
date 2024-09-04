import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils';
import { SxProps } from '@mui/system';
import { SimpleTreeViewClasses } from './simpleTreeViewClasses';
import {
  SimpleTreeViewPluginParameters,
  SimpleTreeViewPluginSlotProps,
  SimpleTreeViewPluginSlots,
  SimpleTreeViewPluginSignatures,
} from './SimpleTreeView.plugins';
import { TreeViewExperimentalFeatures, TreeViewPublicAPI } from '../internals/models';

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

export type SimpleTreeViewApiRef = React.MutableRefObject<
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
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: TreeViewExperimentalFeatures<SimpleTreeViewPluginSignatures>;
}
