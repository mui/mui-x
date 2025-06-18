import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';
import { SimpleTreeViewClassKey } from '../../SimpleTreeView/simpleTreeViewClasses';
import { SimpleTreeViewProps } from '../../SimpleTreeView/SimpleTreeView.types';
import { RichTreeViewClassKey } from '../../RichTreeView/richTreeViewClasses';
import { RichTreeViewProps } from '../../RichTreeView/RichTreeView.types';
import { TreeItemClassKey } from '../../TreeItem/treeItemClasses';
import { TreeItemProps } from '../../TreeItem/TreeItem.types';

export interface TreeViewComponentNameToClassKey {
  MuiSimpleTreeView: SimpleTreeViewClassKey;
  MuiRichTreeView: RichTreeViewClassKey;
  MuiTreeItem: TreeItemClassKey;
}

export interface TreeViewComponentsPropsList {
  MuiSimpleTreeView: SimpleTreeViewProps<any>;
  MuiRichTreeView: RichTreeViewProps<any, any>;
  MuiTreeItem: TreeItemProps;
}

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
  MuiTreeItem?: {
    defaultProps?: ComponentsProps['MuiTreeItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTreeItem'];
    variants?: ComponentsVariants<Theme>['MuiTreeItem'];
  };
}
