import { TreeViewItemId } from '@mui/x-tree-view/models';

export type DataSource<R extends {}> = {
  /**
   * Used to determine the number of children the item has.
   * Only relevant for lazy-loaded trees.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {number} The number of children.
   */
  getChildrenCount: (item: R) => number;
  /**
   * Method used for fetching the items.
   * Only relevant for lazy-loaded tree views.
   *
   * @template R
   * @param {TreeViewItemId} parentId The id of the item the children belong to.
   * @returns { Promise<R[]>} The children of the item.
   */
  getTreeItems: (parentId?: TreeViewItemId) => Promise<R[]>;
};
