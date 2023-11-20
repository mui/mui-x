import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { TreeViewClasses } from './treeViewClasses';
import { DefaultTreeViewPluginParameters } from '../internals/plugins/defaultPlugins';

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

export interface TreeViewProps<Multiple extends boolean | undefined>
  extends DefaultTreeViewPluginParameters<Multiple>,
    TreeViewPropsBase {}
