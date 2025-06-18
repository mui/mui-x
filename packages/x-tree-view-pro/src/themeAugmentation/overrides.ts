import type { TreeViewComponentNameToClassKey } from '@mui/x-tree-view/internals';
import { RichTreeViewProClassKey } from '../RichTreeViewPro';

export interface TreeViewProComponentNameToClassKey
  extends Omit<TreeViewComponentNameToClassKey, 'MuiRichTreeView'> {
  MuiRichTreeViewPro: RichTreeViewProClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewProComponentNameToClassKey {}
}

// disable automatic export
export {};
