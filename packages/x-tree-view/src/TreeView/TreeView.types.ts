import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { TreeViewClasses } from './treeViewClasses';
import { TreeViewPluginParameters } from './TreeView.plugins';

export interface TreeViewProps<Multiple extends boolean | undefined>
  extends TreeViewPluginParameters<Multiple>,
    React.HTMLAttributes<HTMLUListElement> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
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

export type SingleSelectTreeViewProps = TreeViewProps<false>;
export type MultiSelectTreeViewProps = TreeViewProps<true>;
