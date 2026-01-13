import * as React from 'react';
import {
  TreeItemWrapper,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
  TreeViewAnyStore,
} from '../models';
import type { TreeItemProps } from '../../TreeItem/TreeItem.types';
import { TreeViewClasses, TreeViewSlotProps, TreeViewSlots } from './TreeViewStyleContext';
import { UseTreeViewBuildContextParameters } from './useTreeViewBuildContext';

export type TreeViewItemPluginsRunner = (
  props: TreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export type TreeViewStoreInContext<TStore extends TreeViewAnyStore> = Omit<
  TStore,
  | 'setState'
  | 'update'
  | 'set'
  | 'updateStateFromParameters'
  | 'disposeEffect'
  | 'registerStoreEffect'
  | 'itemPluginManager'
  | 'parameters'
>;

export interface TreeViewContextValue<TStore extends TreeViewAnyStore> {
  publicAPI: TreeViewPublicAPI<TStore>;
  store: TreeViewStoreInContext<TStore>;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TStore>;
  runItemPlugins: TreeViewItemPluginsRunner;
}

export interface TreeViewProviderProps<
  TStore extends TreeViewAnyStore,
> extends UseTreeViewBuildContextParameters<TStore> {
  children: React.ReactNode;
  classes: Partial<TreeViewClasses> | undefined;
  slots: TreeViewSlots | undefined;
  slotProps: TreeViewSlotProps | undefined;
}
