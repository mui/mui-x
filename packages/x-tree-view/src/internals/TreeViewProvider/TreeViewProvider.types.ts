import * as React from 'react';
import {
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
} from '../models';
import { TreeViewStore } from '../utils/TreeViewStore';
import type { TreeItemProps } from '../../TreeItem/TreeItem.types';
import { TreeViewClasses, TreeViewSlotProps, TreeViewSlots } from './TreeViewStyleContext';

export type TreeViewItemPluginsRunner = (
  props: TreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export interface TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> {
  instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
  store: TreeViewStore<TSignatures>;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TSignatures>;
  wrapRoot: TreeRootWrapper;
  runItemPlugins: TreeViewItemPluginsRunner;
}

export interface TreeViewProviderProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  contextValue: TreeViewContextValue<TSignatures>;
  children: React.ReactNode;
  classes: Partial<TreeViewClasses> | undefined;
  slots: TreeViewSlots | undefined;
  slotProps: TreeViewSlotProps | undefined;
}
