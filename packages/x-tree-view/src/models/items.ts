// TODO: Add support for number
export type TreeViewItemId = string;

export type TreeViewBaseItem<R extends {} = { id: string; label: string }> = R & {
  children?: TreeViewBaseItem<R>[];
};

export type TreeViewItemsReorderingAction =
  | 'reorder-above'
  | 'reorder-below'
  | 'make-child'
  | 'move-to-parent';
