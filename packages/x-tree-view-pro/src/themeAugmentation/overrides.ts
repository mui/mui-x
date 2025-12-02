import { RichTreeViewProClassKey } from '../RichTreeViewPro';

export interface TreeViewProComponentNameToClassKey {
  MuiRichTreeViewPro: RichTreeViewProClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewProComponentNameToClassKey {}
}

// disable automatic export
export {};
