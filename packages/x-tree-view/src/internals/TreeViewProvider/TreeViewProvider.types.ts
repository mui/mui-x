import * as React from 'react';
import {
  TreeItemWrapper,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
  TreeViewStore,
} from '../models';
import type { TreeItemProps } from '../../TreeItem/TreeItem.types';
import { TreeViewClasses, TreeViewSlotProps, TreeViewSlots } from './TreeViewStyleContext';
import { UseTreeViewBuildContextParameters } from './useTreeViewBuildContext';

export type TreeViewItemPluginsRunner = (
  props: TreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export interface TreeViewContextValue<TStore extends TreeViewStore<any, any>> {
  publicAPI: TreeViewPublicAPI<TStore>;
  store: TStore;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TStore>;
  runItemPlugins: TreeViewItemPluginsRunner;
}

export interface TreeViewProviderProps<TStore extends TreeViewStore<any, any>>
  extends UseTreeViewBuildContextParameters<TStore> {
  children: React.ReactNode;
  classes: Partial<TreeViewClasses> | undefined;
  slots: TreeViewSlots | undefined;
  slotProps: TreeViewSlotProps | undefined;
}
