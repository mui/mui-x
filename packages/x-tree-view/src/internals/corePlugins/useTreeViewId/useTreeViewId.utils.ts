import { TreeViewItemId } from '../../../models';

let globalTreeViewDefaultId = 0;
export const createTreeViewDefaultId = () => {
  globalTreeViewDefaultId += 1;
  return `mui-tree-view-${globalTreeViewDefaultId}`;
};

/**
 * Generate the id attribute (i.e.: the `id` attribute passed to the DOM element) of a Tree Item.
 * If the user explicitly defined an id attribute, it will be returned.
 * Otherwise, the method creates a unique id for the item based on the Tree View id attribute and the item `itemId`
 * @param {object} params The parameters to determine the id attribute of the item.
 * @param {TreeViewItemId} params.itemId The id of the item to get the id attribute of.
 * @param {string | undefined} params.idAttribute The id attribute of the item if explicitly defined by the user.
 * @param {string} params.treeId The id attribute of the Tree View.
 * @returns {string} The id attribute of the item.
 */
export const generateTreeItemIdAttribute = ({
  id,
  treeId = '',
  itemId,
}: {
  id: TreeViewItemId | undefined;
  treeId: string | undefined;
  itemId: string;
}): string => {
  if (id != null) {
    return id;
  }

  return `${treeId}-${itemId}`;
};
