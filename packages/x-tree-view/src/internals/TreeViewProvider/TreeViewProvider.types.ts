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
import type { RawTreeItemProps } from '../../TreeItem/TreeItem.types';

export type TreeViewItemPluginsRunner = (
  props: RawTreeItemProps,
) => Required<TreeViewItemPluginResponse>;

export type TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'contextValue'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'contextValue'>> & {
    instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
    publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
    store: TreeViewStore<TSignatures>;
    rootRef: React.RefObject<HTMLUListElement>;
    wrapItem: TreeItemWrapper<TSignatures>;
    wrapRoot: TreeRootWrapper<TSignatures>;
    runItemPlugins: TreeViewItemPluginsRunner;
  };

export interface TreeViewProviderProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TSignatures>;
  children: React.ReactNode;
}
