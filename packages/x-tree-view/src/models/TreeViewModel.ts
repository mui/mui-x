import * as React from 'react';
import type { UseTreeViewDefaultizedParameters } from '../internals/useTreeView/useTreeView.types';

export interface TreeViewModel<
  Multiple extends boolean,
  TControlled extends keyof UseTreeViewDefaultizedParameters<true>,
> {
  value: Exclude<UseTreeViewDefaultizedParameters<Multiple>[TControlled], undefined>;
  setValue: React.Dispatch<
    React.SetStateAction<Exclude<UseTreeViewDefaultizedParameters<any>[TControlled], undefined>>
  >;
}

// TODO: Define on each plugin
export interface TreeViewModels<Multiple extends boolean> {
  selected: TreeViewModel<Multiple, 'selected'>;
  expanded: TreeViewModel<Multiple, 'expanded'>;
}
