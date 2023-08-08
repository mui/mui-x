import { TreeItemClassKey } from '../TreeItem';
import { TreeViewClassKey } from '../TreeView';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiTreeItem: TreeItemClassKey;
  MuiTreeView: TreeViewClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
