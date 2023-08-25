import * as React from 'react';
import { TreeViewInstance } from './TreeViewInstance';
import { TreeViewState } from './TreeViewState';
import { TreeViewModels } from './TreeViewModel';
import type { UseTreeViewDefaultizedProps } from '../internals/useTreeView/useTreeView.types';
import { TreeViewContextValue } from '../internals/TreeViewProvider';

export interface TreeViewPluginParams<TProps extends Partial<UseTreeViewDefaultizedProps<any>>> {
  instance: TreeViewInstance;
  props: TProps;
  state: TreeViewState;
  models: TreeViewModels<any>;
  setState: React.Dispatch<React.SetStateAction<TreeViewState>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export interface TreeViewModelInitializer<
  TProps extends Partial<UseTreeViewDefaultizedProps<any>>,
> {
  name: string;
  controlledProp: keyof TProps;
  defaultProp: keyof TProps;
}

export type TreeViewPlugin<
  TProps extends Partial<UseTreeViewDefaultizedProps<any>>,
  TState extends Partial<TreeViewState> = {},
> = {
  (params: TreeViewPluginParams<TProps>): void | {
    getRootProps?: () => React.HTMLAttributes<HTMLUListElement>;
    contextValue?: TreeViewContextValue;
  };
  getInitialState?: (props: UseTreeViewDefaultizedProps<any>) => TState;
  models?: TreeViewModelInitializer<TProps>[];
};
