import * as React from 'react';
import { TreeViewItemRange, TreeViewNode } from '../models';

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

export interface TreeViewProviderProps {
  value: TreeViewContextValue;
  children: React.ReactNode;
}
