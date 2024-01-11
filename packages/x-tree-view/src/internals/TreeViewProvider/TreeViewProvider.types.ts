import * as React from 'react';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginOptions,
  TreeViewItemPluginResponse,
} from '../models';

export interface TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  instance: TreeViewInstance<TPlugins>;
  runItemPlugins: (options: TreeViewItemPluginOptions) => Required<TreeViewItemPluginResponse>;
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
