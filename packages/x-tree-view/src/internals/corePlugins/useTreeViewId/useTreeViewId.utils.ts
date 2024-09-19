let globalTreeViewDefaultId = 0;
export const createTreeViewDefaultId = () => {
  globalTreeViewDefaultId += 1;
  return `mui-tree-view-${globalTreeViewDefaultId}`;
};

export const generateTreeItemIdAttribute = ({
  id,
  treeId,
  itemId,
}: {
  id: string | undefined;
  treeId: string;
  itemId: string;
}) => {
  if (id != null) {
    return id;
  }

  return `${treeId}-${itemId}`;
};
