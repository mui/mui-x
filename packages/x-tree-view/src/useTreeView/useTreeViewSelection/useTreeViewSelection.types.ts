import * as React from 'react';
import type { TreeViewItemRange } from '../../TreeView/TreeView.types';

export interface UseTreeViewSelectionInstance {
  isNodeSelected: (nodeId: string) => boolean;
  selectNode: (event: React.SyntheticEvent, nodeId: string, multiple?: boolean) => boolean;
  selectRange: (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked?: boolean) => void;
  rangeSelectToFirst: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
  rangeSelectToLast: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
}

export interface UseTreeViewSelectionState {
  selected: string | string[] | null;
}
