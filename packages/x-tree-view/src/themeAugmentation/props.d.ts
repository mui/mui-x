import { TreeItemProps } from '../TreeItem';
import { TreeViewProps } from '../TreeView';

export interface PickersComponentsPropsList {
  MuiTreeItem: TreeItemProps;
  MuiTreeView: TreeViewProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
