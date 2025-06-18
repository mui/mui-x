import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';
import type { TreeViewComponents } from '@mui/x-tree-view/internals';

export interface TreeViewProComponents<Theme = unknown>
  extends Omit<TreeViewComponents<Theme>, 'MuiRichTreeView'> {
  MuiRichTreeViewPro?: {
    defaultProps?: ComponentsProps['MuiRichTreeViewPro'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRichTreeViewPro'];
    variants?: ComponentsVariants<Theme>['MuiRichTreeViewPro'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends TreeViewProComponents<Theme> {}
}
