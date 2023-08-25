import * as React from 'react';
import { TreeViewInstance } from '../../models';

export interface TreeViewContextValue {
  treeId: string | undefined;
  instance: TreeViewInstance | null;
  multiSelect: boolean;
  disabledItemsFocusable: boolean;
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
