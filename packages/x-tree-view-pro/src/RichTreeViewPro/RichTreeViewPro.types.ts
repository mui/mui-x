import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/base/utils';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { TreeViewPublicAPI } from '@mui/x-tree-view/internals';
import { RichTreeViewProClasses } from './richTreeViewProClasses';
import {
  DefaultTreeViewProPluginParameters,
  DefaultTreeViewProPluginSlotProps,
  DefaultTreeViewProPluginSlots,
  DefaultTreeViewProPlugins,
} from '../internals/plugins/defaultPlugins';

interface RichTreeViewItemProSlotOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewProSlots extends DefaultTreeViewProPluginSlots {
  /**
   * Element rendered at the root.
   * @default RichTreeViewProRoot
   */
  root?: React.ElementType;
  /**
   * Custom component for the item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps> | React.JSXElementConstructor<TreeItem2Props>;
}

export interface RichTreeViewProSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends DefaultTreeViewProPluginSlotProps {
  root?: SlotComponentProps<'ul', {}, RichTreeViewProProps<R, Multiple>>;
  item?: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemProSlotOwnerState>;
}

export type RichTreeViewProApiRef = React.MutableRefObject<
  TreeViewPublicAPI<DefaultTreeViewProPlugins> | undefined
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
  extends DefaultTreeViewProPluginParameters<R, Multiple>,
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
