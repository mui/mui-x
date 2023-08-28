import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewInstance } from './TreeViewInstance';
import { TreeViewState } from './TreeViewState';
import { TreeViewModels } from './TreeViewModel';
import type { UseTreeViewDefaultizedParameters } from '../internals/useTreeView/useTreeView.types';
import type { TreeViewContextValue } from '../internals/TreeViewProvider';

export interface TreeViewPluginParams<
  TProps extends Partial<UseTreeViewDefaultizedParameters<any>>,
> {
  instance: TreeViewInstance;
  props: TProps;
  state: TreeViewState;
  models: TreeViewModels<any>;
  setState: React.Dispatch<React.SetStateAction<TreeViewState>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export interface TreeViewModelInitializer<
  TProps extends Partial<UseTreeViewDefaultizedParameters<any>>,
> {
  name: string;
  controlledProp: keyof TProps;
  defaultProp: keyof TProps;
}

interface TreeViewResponse {
  getRootProps?: <TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>;
  contextValue?: TreeViewContextValue;
}

export type TreeViewPlugin<
  TProps extends Partial<UseTreeViewDefaultizedParameters<any>>,
  TState extends Partial<TreeViewState> = {},
> = {
  (params: TreeViewPluginParams<TProps>): void | TreeViewResponse;
  getInitialState?: (props: UseTreeViewDefaultizedParameters<any>) => TState;
  models?: TreeViewModelInitializer<TProps>[];
};
