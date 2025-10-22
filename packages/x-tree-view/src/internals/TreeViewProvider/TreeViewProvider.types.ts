import * as React from 'react';
import {
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
  TreeViewReadonlyStore,
} from '../models';
import type { TreeItemProps } from '../../TreeItem/TreeItem.types';
import { TreeViewClasses, TreeViewSlotProps, TreeViewSlots } from './TreeViewStyleContext';
import { TreeViewCorePluginSignatures } from '../corePlugins';
import { TreeViewStore } from '../TreeViewStore';

export type TreeViewItemPluginsRunner = (
  props: TreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export interface TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> {
  instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
  store: TreeViewReadonlyStore<readonly [...TreeViewCorePluginSignatures, ...TSignatures]>;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TSignatures>;
  wrapRoot: TreeRootWrapper;
  runItemPlugins: TreeViewItemPluginsRunner;
}

export interface TreeViewProviderProps<Store extends TreeViewStore<any, any, any, any>> {
  store: Store;
  children: React.ReactNode;
  classes: Partial<TreeViewClasses> | undefined;
  slots: TreeViewSlots | undefined;
  slotProps: TreeViewSlotProps | undefined;
}
