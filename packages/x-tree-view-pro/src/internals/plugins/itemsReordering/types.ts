import { TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';

export interface TreeViewItemReorderPosition {
  parentId: string | null;
  index: number;
}

export type TreeViewItemItemReorderingValidActions = {
  [key in TreeViewItemsReorderingAction]?: TreeViewItemReorderPosition;
};
