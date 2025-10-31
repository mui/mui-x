// TODO: Add support for number
export type TreeViewItemId = string;

export type TreeViewDefaultItemModelProperties = {
  id: string;
  label: string;
  children?: TreeViewDefaultItemModelProperties[];
};

export type TreeViewBaseItem<R extends {} = TreeViewDefaultItemModelProperties> = R & {
  children?: TreeViewBaseItem<R>[];
};

export type TreeViewValidItem<R extends {}> = { children?: R[] };

export type TreeViewItemsReorderingAction =
  | 'reorder-above'
  | 'reorder-below'
  | 'make-child'
  | 'move-to-parent';

export interface TreeViewSelectionPropagation {
  descendants?: boolean;
  parents?: boolean;
}
