import * as React from 'react';
import { TreeViewInstance } from '../../models';
import type { DefaultPlugins } from '../useTreeView/useTreeView';

export interface TreeViewContextValue {
  treeId: string | undefined;
  instance: TreeViewInstance<DefaultPlugins> | null;
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
