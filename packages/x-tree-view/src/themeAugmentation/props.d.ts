import { TreeItemProps } from '../TreeItem';
import { SimpleTreeViewProps } from '../SimpleTreeView';
import { TreeViewProps } from '../TreeView';

export interface TreeViewComponentsPropsList {
  MuiTreeItem: TreeItemProps;
  MuiTreeView: TreeViewProps<any>;
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
