import * as React from 'react';
import {
  MergePluginsProperty,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginOptions,
  TreeViewItemPluginResponse,
} from '../models';

export type TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TPlugins, 'contextValue'> & {
    instance: TreeViewInstance<TPlugins>;
    runItemPlugins: (
      options: TreeViewItemPluginOptions,
    ) => Pick<TreeViewItemPluginResponse, 'ref'> &
      Required<Omit<TreeViewItemPluginResponse, 'ref'>>;
  };

export interface TreeViewProviderProps<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}
