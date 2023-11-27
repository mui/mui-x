import { RichTreeViewClassKey } from '../RichTreeView';
import { TreeItemClassKey } from '../TreeItem';
import { TreeViewClassKey } from '../TreeView';

// prettier-ignore
export interface TreeViewComponentNameToClassKey {
  MuiTreeItem: TreeItemClassKey;
  MuiTreeView: TreeViewClassKey;
  MuiRichTreeView: RichTreeViewClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
}

// disable automatic export
export {};
