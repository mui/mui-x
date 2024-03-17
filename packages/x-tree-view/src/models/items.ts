// TODO: Add support for number
export type TreeViewItemId = string;

export type TreeViewBaseItem<R extends {} = { id: string; label: string }> = R & {
  children?: TreeViewBaseItem<R>[];
};
