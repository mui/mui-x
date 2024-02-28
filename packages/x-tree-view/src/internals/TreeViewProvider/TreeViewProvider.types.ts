import * as React from 'react';
import {
  MergePluginsProperty,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginOptions,
  TreeViewItemPluginResponse,
} from '../models';
import { TreeViewCorePluginsSignature } from '../corePlugins';

export type TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TPlugins, 'contextValue'> &
    TreeViewCorePluginsSignature['contextValue'] & {
      instance: TreeViewInstance<TPlugins>;
      runItemPlugins: (options: TreeViewItemPluginOptions) => Required<TreeViewItemPluginResponse>;
    };

export interface TreeViewProviderProps<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}
