import { RichTreeViewProProps } from '../RichTreeViewPro';

export interface TreeViewComponentsPropsList {
  MuiRichTreeViewPro: RichTreeViewProProps<any, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
}

// disable automatic export
export {};
