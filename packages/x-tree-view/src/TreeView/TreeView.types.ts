import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { TreeViewClasses } from './treeViewClasses';
import { UseTreeViewProps } from '../internals/useTreeView';
import { TreeViewItemRange, TreeViewNode } from '../internals/models';

export interface TreeViewPropsBase extends React.HTMLAttributes<HTMLUListElement> {
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
   * The default icon used to collapse the node.
   */
  defaultCollapseIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a end node. This is applied to all
   * tree nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultEndIcon?: React.ReactNode;
  /**
   * The default icon used to expand the node.
   */
  defaultExpandIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a parent node. This is applied to all
   * parent nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultParentIcon?: React.ReactNode;
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export type TreeViewProps<Multiple extends boolean | undefined> = UseTreeViewProps<Multiple> &
  TreeViewPropsBase;

export type SingleSelectTreeViewProps = TreeViewProps<false>;
export type MultiSelectTreeViewProps = TreeViewProps<true>;

export interface TreeViewContextValue {
  registerNode: (node: TreeViewNode) => void;
  unregisterNode: (nodeId: string) => void;
  isFocused: (nodeId: string) => boolean;
  isSelected: (nodeId: string) => boolean;
  isExpanded: (nodeId: string) => boolean;
  isExpandable: (nodeId: string) => boolean;
  isDisabled: (nodeId: string) => boolean;
  mapFirstChar: (nodeId: string, firstChar: string) => void;
  unMapFirstChar: (nodeId: string) => void;
  focus: (event: React.SyntheticEvent, nodeId: string) => void;
  toggleExpansion: (event: React.SyntheticEvent, value: string) => void;
  selectNode: (event: React.SyntheticEvent, nodeId: string, multiple?: boolean) => void;
  selectRange: (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked?: boolean) => void;
  multiSelect: boolean;
  disabledItemsFocusable: boolean;
  treeId: string | undefined;
  icons: {
    defaultCollapseIcon: React.ReactNode;
    defaultExpandIcon: React.ReactNode;
    defaultParentIcon: React.ReactNode;
    defaultEndIcon: React.ReactNode;
  };
}
