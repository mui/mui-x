import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/base/utils';
import { TreeViewClasses } from './treeViewClasses';
import { DefaultTreeViewPluginParameters } from '../internals/plugins/defaultPlugins';
import { TreeItem, TreeItemProps } from '../TreeItem';
import { TreeViewBaseItem } from '../models';

interface TreeViewItemSlotOwnerState<R extends {}> {
  item: TreeViewBaseItem<R>;
}

export interface TreeViewSlotsComponent {
  /**
   * Custom component for the item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface TreeViewSlotsComponentsProps<R extends {}> {
  item?: SlotComponentProps<typeof TreeItem, {}, TreeViewItemSlotOwnerState<R>>;
}

export interface TreeViewPropsBase extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeViewClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export interface TreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends DefaultTreeViewPluginParameters<R, Multiple>,
    TreeViewPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeViewSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeViewSlotsComponentsProps<R>;
}
