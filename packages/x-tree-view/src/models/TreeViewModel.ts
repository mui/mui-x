import * as React from 'react';
import type { UseTreeViewDefaultizedProps } from '../internals/useTreeView/useTreeView.types';

export interface TreeViewModel<
  Multiple extends boolean,
  TControlled extends keyof UseTreeViewDefaultizedProps<true>,
> {
  value: Exclude<UseTreeViewDefaultizedProps<Multiple>[TControlled], undefined>;
  setValue: React.Dispatch<
    React.SetStateAction<Exclude<UseTreeViewDefaultizedProps<any>[TControlled], undefined>>
  >;
}

// TODO: Define on each plugin
export interface TreeViewModels<Multiple extends boolean> {
  selected: TreeViewModel<Multiple, 'selected'>;
  expanded: TreeViewModel<Multiple, 'expanded'>;
}
