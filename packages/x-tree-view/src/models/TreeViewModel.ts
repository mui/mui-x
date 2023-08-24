import * as React from 'react';
import type { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';
import type { UseTreeViewProps } from '../useTreeView/useTreeView.types';

export interface TreeViewModel<TControlled extends keyof UseTreeViewProps> {
  controlledProp: TControlled;
  defaultProp: keyof TreeViewDefaultizedProps;
  isControlled: boolean;
  value: Exclude<UseTreeViewProps[TControlled], undefined>;
  setValue: React.Dispatch<React.SetStateAction<Exclude<UseTreeViewProps[TControlled], undefined>>>;
}

// TODO: Define on each plugin
export interface TreeViewModels {
  selected: TreeViewModel<'selected'>;
  expanded: TreeViewModel<'expanded'>;
}
