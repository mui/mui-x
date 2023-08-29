import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewModels } from './TreeViewModel';
import type { UseTreeViewDefaultizedParameters } from '../internals/useTreeView/useTreeView.types';
import type { TreeViewContextValue } from '../internals/TreeViewProvider';
import { MergePluginsProperty } from '../internals/models';

export interface TreeViewPluginParams<TSignature extends TreeViewAnyPluginSignature> {
  instance: TreeViewUsedInstance<TSignature>;
  // TODO: Rename 'params'
  props: TreeViewUsedParams<TSignature>;
  state: TreeViewUsedState<TSignature>;
  models: TreeViewModels<any>;
  setState: React.Dispatch<React.SetStateAction<TreeViewUsedState<TSignature>>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export interface TreeViewModelInitializer<TSignature extends TreeViewAnyPluginSignature> {
  name: string;
  controlledProp: keyof TSignature['params'];
  defaultProp: keyof TSignature['params'];
}

interface TreeViewResponse {
  getRootProps?: <TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>;
  contextValue?: TreeViewContextValue<any>;
}

export type TreeViewPluginSignature<
  TParams extends {},
  TDefaultizedParams extends {},
  TInstance extends {},
  TState extends {},
  TDependantPlugins extends readonly TreeViewAnyPluginSignature[],
> = {
  state: TState;
  instance: TInstance;
  params: TParams;
  defaultizedParams: TDefaultizedParams;
  dependantPlugins: TDependantPlugins;
};

export type TreeViewAnyPluginSignature = TreeViewPluginSignature<any, any, any, any, any>;

export type TreeViewUsedParams<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['defaultizedParams'] &
    MergePluginsProperty<TSignature['dependantPlugins'], 'defaultizedParams'>;
export type TreeViewUsedInstance<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['instance'] & MergePluginsProperty<TSignature['dependantPlugins'], 'instance'>;
export type TreeViewUsedState<TSignature extends TreeViewAnyPluginSignature> = TSignature['state'] &
  MergePluginsProperty<TSignature['dependantPlugins'], 'state'>;

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  (params: TreeViewPluginParams<TSignature>): void | TreeViewResponse;
  getInitialState?: (props: UseTreeViewDefaultizedParameters<any>) => TSignature['state'];
  models?: TreeViewModelInitializer<TSignature>[];
};
