import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface TreeViewComponents<Theme = unknown> {
  MuiTreeItem?: {
    defaultProps?: ComponentsProps['MuiTreeItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem'];
    variants?: ComponentsVariants['MuiTreeItem'];
  };
  MuiTreeView?: {
    defaultProps?: ComponentsProps['MuiTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeView'];
    variants?: ComponentsVariants['MuiTreeView'];
  };
  MuiSimpleTreeView?: {
    defaultProps?: ComponentsProps['MuiSimpleTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSimpleTreeView'];
    variants?: ComponentsVariants['MuiSimpleTreeView'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewComponents<Theme> {}
}
