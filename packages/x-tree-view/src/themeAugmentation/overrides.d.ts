import { RichTreeViewClassKey } from '../RichTreeView';
import { SimpleTreeViewClassKey } from '../SimpleTreeView';
import { TreeViewClassKey } from '../TreeView';
import { TreeItemClassKey } from '../TreeItem';

// prettier-ignore
export interface TreeViewComponentNameToClassKey {
  MuiSimpleTreeView: SimpleTreeViewClassKey;
  MuiRichTreeView: RichTreeViewClassKey;
  MuiTreeView: TreeViewClassKey;
  MuiTreeItem: TreeItemClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
}

// disable automatic export
export {};
