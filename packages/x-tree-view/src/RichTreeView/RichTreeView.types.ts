import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/base/utils';
import { RichTreeViewClasses } from './richTreeViewClasses';
import { DefaultTreeViewPluginParameters } from '../internals/plugins/defaultPlugins';
import { TreeItem, TreeItemProps } from '../TreeItem';
import { TreeViewItemId } from '../models';

interface RichTreeViewItemSlotOwnerState {
  nodeId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewSlotsComponent {
  /**
   * Element rendered at the root.
   * @default TreeViewRoot
   */
  root?: React.ElementType;
  /**
   * Custom component for the item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface RichTreeViewSlotsComponentsProps<
  R extends {},
  Multiple extends boolean | undefined,
> {
  root?: SlotComponentProps<'ul', {}, RichTreeViewProps<R, Multiple>>;
  item?: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemSlotOwnerState>;
}

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
  extends DefaultTreeViewPluginParameters<R, Multiple>,
    RichTreeViewPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewSlotsComponentsProps<R, Multiple>;
}
