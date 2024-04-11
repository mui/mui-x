import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface TreeViewComponents<Theme = unknown> {
  MuiRichTreeViewPro?: {
    defaultProps?: ComponentsProps['MuiRichTreeViewPro'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRichTreeViewPro'];
    variants?: ComponentsVariants<Theme>['MuiRichTreeViewPro'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewComponents<Theme> {}
}
