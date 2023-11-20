// TODO: Add support for number
export type TreeViewItemId = string;

export interface TreeViewItem {
  nodeId: TreeViewItemId;
  id?: string;
  label: string;
  disabled?: boolean;
  children?: TreeViewItem[];
}
