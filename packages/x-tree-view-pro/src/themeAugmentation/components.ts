import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface TreeViewProComponents<Theme = unknown> {
  MuiRichTreeViewPro?: {
    defaultProps?: ComponentsProps['MuiRichTreeViewPro'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRichTreeViewPro'];
    variants?: ComponentsVariants<Theme>['MuiRichTreeViewPro'];
  };
  MuiSimpleTreeView?: {
    defaultProps?: ComponentsProps['MuiSimpleTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSimpleTreeView'];
    variants?: ComponentsVariants<Theme>['MuiSimpleTreeView'];
  };
  MuiTreeItem?: {
    defaultProps?: ComponentsProps['MuiTreeItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem'];
    variants?: ComponentsVariants<Theme>['MuiTreeItem'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewProComponents<Theme> {}
}
