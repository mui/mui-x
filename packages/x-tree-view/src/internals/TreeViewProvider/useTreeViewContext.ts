import * as React from 'react';
import { TreeViewAnyPluginSignature } from '../../models';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewContextValue } from './TreeViewProvider.types';

export const useTreeViewContext = <TPlugins extends readonly TreeViewAnyPluginSignature[]>() =>
  React.useContext(TreeViewContext) as TreeViewContextValue<TPlugins>;
