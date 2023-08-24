import * as React from 'react';
import type { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';

export interface TreeViewModel<TControlled extends keyof TreeViewDefaultizedProps> {
  controlledProp: TControlled;
  defaultProp: keyof TreeViewDefaultizedProps;
  isControlled: boolean;
  value: Exclude<TreeViewDefaultizedProps[TControlled], undefined>;
  setValue: React.Dispatch<
    React.SetStateAction<Exclude<TreeViewDefaultizedProps[TControlled], undefined>>
  >;
}

// TODO: Define on each plugin
export interface TreeViewModels {
  selected: TreeViewModel<'selected'>;
  expanded: TreeViewModel<'expanded'>;
}
