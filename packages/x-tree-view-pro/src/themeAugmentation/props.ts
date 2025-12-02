import { RichTreeViewProProps } from '../RichTreeViewPro';

export interface TreeViewProComponentsPropsList {
  MuiRichTreeViewPro: RichTreeViewProProps<any, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends TreeViewProComponentsPropsList {}
}

// disable automatic export
export {};
