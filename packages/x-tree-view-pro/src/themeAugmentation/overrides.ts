import type { SimpleTreeViewClassKey } from '@mui/x-tree-view/SimpleTreeView';
import type { TreeItemClassKey } from '@mui/x-tree-view/TreeItem';
import { RichTreeViewProClassKey } from '../RichTreeViewPro';

export interface TreeViewProComponentNameToClassKey {
  MuiSimpleTreeView: SimpleTreeViewClassKey;
  MuiTreeItem: TreeItemClassKey;
  MuiRichTreeViewPro: RichTreeViewProClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewProComponentNameToClassKey {}
}

// disable automatic export
export {};
