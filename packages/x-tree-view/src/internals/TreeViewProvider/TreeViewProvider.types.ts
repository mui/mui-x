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
import { TreeViewCorePluginSignatures } from '../corePlugins';

export type TreeViewItemPluginsRunner = <TProps extends {}>(
  props: TProps,
) => Required<TreeViewItemPluginResponse>;

export type TreeViewContextValue<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'contextValue'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'contextValue'>> & {
    instance: TreeViewInstance<TSignatures, TOptionalSignatures>;
    publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
    rootRef: React.RefObject<HTMLUListElement | null>;
    wrapItem: TreeItemWrapper<TSignatures>;
    wrapRoot: TreeRootWrapper<TSignatures>;
    runItemPlugins: TreeViewItemPluginsRunner;
  };

export interface TreeViewProviderProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TSignatures>;
  children: React.ReactNode;
}
