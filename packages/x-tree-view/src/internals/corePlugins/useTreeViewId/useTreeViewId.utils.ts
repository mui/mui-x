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
