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

export type TreeViewItemPluginsRunner = <TProps extends {}>(
  props: TProps,
) => Required<TreeViewItemPluginResponse>;

export type TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<TSignatures, 'contextValue'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'contextValue'>> & {
    instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
    publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
    store: TreeViewStore<TSignatures>;
    rootRef: React.RefObject<HTMLUListElement>;
    wrapItem: TreeItemWrapper;
    wrapRoot: TreeRootWrapper<TSignatures>;
    runItemPlugins: TreeViewItemPluginsRunner;
  };

export interface TreeViewProviderProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TSignatures>;
  children: React.ReactNode;
}
