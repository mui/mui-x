import * as React from 'react';
import {
  MergePluginsProperty,
  TreeItemWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginOptions,
  TreeViewItemPluginResponse,
} from '../models';

export type TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TPlugins, 'contextValue'> & {
    instance: TreeViewInstance<TPlugins>;
    wrapItem: TreeItemWrapper;
    runItemPlugins: <TProps extends {}>(
      options: TreeViewItemPluginOptions<TProps>,
    ) => Pick<TreeViewItemPluginResponse<TProps>, 'ref'> &
      Required<Omit<TreeViewItemPluginResponse<TProps>, 'ref'>>;
  };

export interface TreeViewProviderProps<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}
