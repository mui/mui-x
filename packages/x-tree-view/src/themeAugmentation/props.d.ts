import { TreeItemProps } from '../TreeItem';
import { TreeViewProps } from '../TreeView';
import { RichTreeViewProps } from '../RichTreeView';

export interface TreeViewComponentsPropsList {
  MuiTreeItem: TreeItemProps;
  MuiTreeView: TreeViewProps<any>;
  MuiRichTreeView: RichTreeViewProps<any, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
