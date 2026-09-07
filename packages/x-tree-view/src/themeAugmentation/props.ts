import type { SimpleTreeViewProps } from '../SimpleTreeView';
import type { RichTreeViewProps } from '../RichTreeView';
import type { TreeItemProps } from '../TreeItem';

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
