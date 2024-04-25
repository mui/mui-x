import { TreeItemProps } from '../TreeItem';
import { TreeViewProps } from '../TreeView';
import { SimpleTreeViewProps } from '../SimpleTreeView';
import { RichTreeViewProps } from '../RichTreeView';
import { TreeItem2Props } from '../TreeItem2';

export interface TreeViewComponentsPropsList {
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
  MuiRichTreeView: RichTreeViewProps<any, any>;
  MuiTreeView: TreeViewProps<any>;
  MuiTreeItem: TreeItemProps;
  MuiTreeItem2: TreeItem2Props;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
