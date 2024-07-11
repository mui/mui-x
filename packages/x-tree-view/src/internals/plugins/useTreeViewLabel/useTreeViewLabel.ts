import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({
  instance,
  state,
  setState,
  params,
}) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    setState((prevState) => ({ ...prevState, editedItemId }));
  };
  const isItemBeingEdited = (itemId: TreeViewItemId) => itemId === state.editedItemId;

  const isItemEditable = (itemId: TreeViewItemId): boolean => {
    if (itemId == null) {
      return false;
    }
    const item = instance.getItem(itemId);

    if (!item) {
      return false;
    }
    return params.isItemEditable ? params.isItemEditable(item) : false;
  };

  const isTreeViewEditable = Boolean(params.isItemEditable);

  const updateItemLabel = (itemId: TreeViewItemId, label: string) => {
    if (!label) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'The label of an item cannot be empty.',
          JSON.stringify(itemId),
        ].join('\n'),
      );
    }
    setState((prevState) => {
      const item = prevState.items.itemMetaMap[itemId];
      if (item.label !== label) {
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaMap: { ...prevState.items.itemMetaMap, [itemId]: { ...item, label } },
          },
        };
      }

      return prevState;
    });

    if (params.onItemLabelChange) {
      params.onItemLabelChange(itemId, label);
    }
  };

  return {
    instance: {
      setEditedItemId,
      isItemBeingEdited,
      updateItemLabel,
      isItemEditable,
      isTreeViewEditable,
    },
    publicAPI: {
      updateItemLabel,
    },
  };
};

useTreeViewLabel.getInitialState = () => ({
  editedItemId: null,
});

useTreeViewLabel.params = {
  onItemLabelChange: true,
  isItemEditable: true,
};
