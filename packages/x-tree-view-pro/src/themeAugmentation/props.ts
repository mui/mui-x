import type { SimpleTreeViewProps } from '@mui/x-tree-view/SimpleTreeView';
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { RichTreeViewProProps } from '../RichTreeViewPro';

export interface TreeViewProComponentsPropsList {
  MuiRichTreeViewPro: RichTreeViewProProps<any, any>;
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
  MuiTreeItem: TreeItemProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewProComponentsPropsList {}
}

// disable automatic export
export {};
