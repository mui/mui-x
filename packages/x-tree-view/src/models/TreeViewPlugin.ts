import * as React from 'react';
import { TreeViewInstance } from './TreeViewInstance';
import { TreeViewState } from './TreeViewState';
import { TreeViewModels } from './TreeViewModel';
import type {
  UseTreeViewDefaultizedProps,
  UseTreeViewProps,
} from '../useTreeView/useTreeView.types';

export interface TreeViewPluginParams<TProps extends Partial<UseTreeViewDefaultizedProps>> {
  instance: TreeViewInstance;
  props: TProps;
  state: TreeViewState;
  models: TreeViewModels;
  setState: React.Dispatch<React.SetStateAction<TreeViewState>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export interface TreeViewModelInitializer<TProps extends Partial<UseTreeViewDefaultizedProps>> {
  name: string;
  controlledProp: keyof TProps;
  defaultProp: keyof TProps;
}

export type TreeViewPlugin<
  TProps extends Partial<UseTreeViewDefaultizedProps>,
  TState extends Partial<TreeViewState> = {},
> = {
  (params: TreeViewPluginParams<TProps>): void | {
    rootProps?: React.HTMLAttributes<HTMLUListElement>;
  };
  getInitialState?: (props: UseTreeViewDefaultizedProps) => TState;
  models?: TreeViewModelInitializer<TProps>[];
};
