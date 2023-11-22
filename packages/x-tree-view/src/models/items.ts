// TODO: Add support for number
export type TreeViewItemId = string;

interface TreeViewBaseItemProperties {
  nodeId: TreeViewItemId;
  id?: string;
  label: string;
}

export type TreeViewBaseItem<R extends {} = {}> = TreeViewBaseItemProperties &
  R & {
    children?: TreeViewBaseItem<R>[];
  };
