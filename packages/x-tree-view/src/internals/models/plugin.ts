import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewModel } from './treeView';
import type { TreeViewContextValue } from '../TreeViewProvider';
import type { MergePluginsProperty } from './helpers';

export interface TreeViewPluginOptions<TSignature extends TreeViewAnyPluginSignature> {
  instance: TreeViewUsedInstance<TSignature>;
  params: TreeViewUsedDefaultizedParams<TSignature>;
  state: TreeViewUsedState<TSignature>;
  models: TreeViewUsedModels<TSignature>;
  setState: React.Dispatch<React.SetStateAction<TreeViewUsedState<TSignature>>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

type TreeViewModelsInitializer<TSignature extends TreeViewAnyPluginSignature> = {
  [TControlled in keyof TSignature['models']]: {
    controlledProp: TControlled;
    defaultProp: keyof TSignature['params'];
  };
};

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
  TModelNames extends keyof TDefaultizedParams,
  TDependantPlugins extends readonly TreeViewAnyPluginSignature[],
> = {
  params: TParams;
  defaultizedParams: TDefaultizedParams;
  instance: TInstance;
  state: TState;
  models: {
    [TControlled in TModelNames]-?: TreeViewModel<
      Exclude<TDefaultizedParams[TControlled], undefined>
    >;
  };
  dependantPlugins: TDependantPlugins;
};

export type TreeViewAnyPluginSignature = {
  state: any;
  instance: any;
  params: any;
  defaultizedParams: any;
  dependantPlugins: any;
  models: any;
};

type TreeViewUsedParams<TSignature extends TreeViewAnyPluginSignature> = TSignature['params'] &
  MergePluginsProperty<TSignature['dependantPlugins'], 'params'>;

type TreeViewUsedDefaultizedParams<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['defaultizedParams'] &
    MergePluginsProperty<TSignature['dependantPlugins'], 'defaultizedParams'>;

export type TreeViewUsedInstance<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['instance'] & MergePluginsProperty<TSignature['dependantPlugins'], 'instance'>;

type TreeViewUsedState<TSignature extends TreeViewAnyPluginSignature> = TSignature['state'] &
  MergePluginsProperty<TSignature['dependantPlugins'], 'state'>;

export type TreeViewUsedModels<TSignature extends TreeViewAnyPluginSignature> =
  TSignature['models'] & MergePluginsProperty<TSignature['dependantPlugins'], 'models'>;

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  (options: TreeViewPluginOptions<TSignature>): void | TreeViewResponse;
  getDefaultizedParams?: (
    params: TreeViewUsedParams<TSignature>,
  ) => TSignature['defaultizedParams'];
  getInitialState?: (params: TreeViewUsedDefaultizedParams<TSignature>) => TSignature['state'];
  models?: TreeViewModelsInitializer<TSignature>;
};
