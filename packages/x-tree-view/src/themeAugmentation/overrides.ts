import type { RichTreeViewClassKey } from '../RichTreeView';
import type { SimpleTreeViewClassKey } from '../SimpleTreeView';
import type { TreeItemClassKey } from '../TreeItem';

// prettier-ignore
export interface TreeViewComponentNameToClassKey {
  MuiSimpleTreeView: SimpleTreeViewClassKey;
  MuiRichTreeView: RichTreeViewClassKey;
  MuiTreeItem: TreeItemClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
}

// disable automatic export
export {};
