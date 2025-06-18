import type { TreeViewComponentsPropsList } from '@mui/x-tree-view/internals';
import { RichTreeViewProProps } from '../RichTreeViewPro';

export interface TreeViewProComponentsPropsList
  extends Omit<TreeViewComponentsPropsList, 'MuiRichTreeView'> {
  MuiRichTreeViewPro: RichTreeViewProProps<any, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewProComponentsPropsList {}
}

// disable automatic export
export {};
