import * as React from 'react';
import {
  MergeSignaturesProperty,
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
} from '../models';
import { TreeViewStore } from '../utils/TreeViewStore';
import { TreeViewCorePluginSignatures } from '../corePlugins';
import type { TreeItemProps } from '../../TreeItem/TreeItem.types';

export type TreeViewItemPluginsRunner = (
  props: TreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export type TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'contextValue'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'contextValue'>> & {
    instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
    publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
    store: TreeViewStore<TSignatures>;
    rootRef: React.RefObject<HTMLUListElement | null>;
    wrapItem: TreeItemWrapper<TSignatures>;
    wrapRoot: TreeRootWrapper;
    runItemPlugins: TreeViewItemPluginsRunner;
  };

export interface TreeViewProviderProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TSignatures>;
  children: React.ReactNode;
}
