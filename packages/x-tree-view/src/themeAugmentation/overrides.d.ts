import { TreeItemClassKey } from '../TreeItem';
import { TreeViewClassKey } from '../TreeView';
import { SimpleTreeViewClassKey } from '../SimpleTreeView';

// prettier-ignore
export interface TreeViewComponentNameToClassKey {
  MuiTreeItem: TreeItemClassKey;
  MuiTreeView: TreeViewClassKey;
  MuiSimpleTreeView: SimpleTreeViewClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
}

// disable automatic export
export {};
