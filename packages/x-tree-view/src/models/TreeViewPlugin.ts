import * as React from 'react';
import { TreeViewInstance } from './TreeViewInstance';
import { TreeViewState } from './TreeViewState';
import type { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';

export interface TreeViewPluginParams {
  instance: TreeViewInstance;
  props: TreeViewDefaultizedProps;
  state: TreeViewState;
  setState: React.Dispatch<React.SetStateAction<TreeViewState>>;
  rootRef: React.RefObject<HTMLUListElement>;
}

export type TreeViewPlugin<TState extends Partial<TreeViewState> = {}> = {
  (params: TreeViewPluginParams): void | { rootProps?: React.HTMLAttributes<HTMLUListElement> };
  getInitialState?: (props: TreeViewDefaultizedProps) => TState;
};
