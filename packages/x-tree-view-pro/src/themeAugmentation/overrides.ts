import { RichTreeViewProClassKey } from '../RichTreeViewPro';

// prettier-ignore
export interface TreeViewComponentNameToClassKey {
  MuiRichTreeViewPro: RichTreeViewProClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
}

// disable automatic export
export {};
