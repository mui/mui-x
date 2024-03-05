import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface TreeViewComponents<Theme = unknown> {
  MuiSimpleTreeView?: {
    defaultProps?: ComponentsProps['MuiSimpleTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSimpleTreeView'];
    variants?: ComponentsVariants<Theme>['MuiSimpleTreeView'];
  };
  MuiRichTreeView?: {
    defaultProps?: ComponentsProps['MuiRichTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRichTreeView'];
    variants?: ComponentsVariants<Theme>['MuiRichTreeView'];
  };
  MuiTreeView?: {
    defaultProps?: ComponentsProps['MuiTreeView'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeView'];
    variants?: ComponentsVariants<Theme>['MuiTreeView'];
  };
  MuiTreeItem?: {
    defaultProps?: ComponentsProps['MuiTreeItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem'];
    variants?: ComponentsVariants<Theme>['MuiTreeItem'];
  };
  MuiTreeItem2?: {
    defaultProps?: ComponentsProps['MuiTreeItem2'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem2'];
    variants?: ComponentsVariants<Theme>['MuiTreeItem2'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewComponents<Theme> {}
}
