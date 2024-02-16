import { TreeItemProps } from '../TreeItem';
import { TreeViewProps } from '../TreeView';
import { SimpleTreeViewProps } from '../SimpleTreeView';
import { RichTreeViewProps } from '../RichTreeView';
import { TreeItemNextProps } from '../internals/TreeItemNext';

export interface TreeViewComponentsPropsList {
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
  MuiRichTreeView: RichTreeViewProps<any, any>;
  MuiTreeView: TreeViewProps<any>;
  MuiTreeItem: TreeItemProps;
  MuiTreeItemNext: TreeItemNextProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
