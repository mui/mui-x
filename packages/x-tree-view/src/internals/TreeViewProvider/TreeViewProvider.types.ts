import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewInstance } from '../models';

export interface TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  instance: TreeViewInstance<TPlugins>;
  multiSelect: boolean;
  disabledItemsFocusable: boolean;
  icons: {
    defaultCollapseIcon: React.ReactNode;
    defaultExpandIcon: React.ReactNode;
    defaultParentIcon: React.ReactNode;
    defaultEndIcon: React.ReactNode;
  };
}

export interface TreeViewProviderProps<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}
