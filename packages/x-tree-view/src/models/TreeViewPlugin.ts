import * as React from 'react';
import { TreeViewInstance } from './TreeViewInstance';
import { TreeViewState } from './TreeViewState';
import { TreeViewModels } from './TreeViewModel';
import type { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';

export interface TreeViewPluginParams {
  instance: TreeViewInstance;
  props: TreeViewDefaultizedProps;
  state: TreeViewState;
  models: TreeViewModels;
  setState: React.Dispatch<React.SetStateAction<TreeViewState>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export interface TreeViewModelInitializer {
  name: string;
  controlledProp: keyof TreeViewDefaultizedProps;
  defaultProp: keyof TreeViewDefaultizedProps;
}

export type TreeViewPlugin<TState extends Partial<TreeViewState> = {}> = {
  (params: TreeViewPluginParams): void | { rootProps?: React.HTMLAttributes<HTMLUListElement> };
  getInitialState?: (props: TreeViewDefaultizedProps) => {
    state?: TState;
    models?: TreeViewModelInitializer[];
  };
};
