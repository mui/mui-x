import { SimpleTreeViewProps } from '../SimpleTreeView';
import { RichTreeViewProps } from '../RichTreeView';
import { TreeItemProps } from '../TreeItem';

export interface TreeViewComponentsPropsList {
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
  MuiRichTreeView: RichTreeViewProps<any, any>;
  MuiTreeItem: TreeItemProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
