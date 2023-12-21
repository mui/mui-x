import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface TreeViewComponents<Theme = unknown> {
  MuiSimpleTreeView?: {
    defaultProps?: ComponentsProps['MuiSimpleTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSimpleTreeView'];
    variants?: ComponentsVariants['MuiSimpleTreeView'];
  };
  MuiRichTreeView?: {
    defaultProps?: ComponentsProps['MuiRichTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRichTreeView'];
    variants?: ComponentsVariants['MuiRichTreeView'];
  };
  MuiTreeView?: {
    defaultProps?: ComponentsProps['MuiTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeView'];
    variants?: ComponentsVariants['MuiTreeView'];
  };
  MuiTreeItem?: {
    defaultProps?: ComponentsProps['MuiTreeItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem'];
    variants?: ComponentsVariants['MuiTreeItem'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewComponents<Theme> {}
}
