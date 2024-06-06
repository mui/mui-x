import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';

import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

const getItemsLabels = (items: readonly any[], getItemLabel): {} => {
  const labels = items.reduce((acc, item) => {
    const label = getItemLabel ? getItemLabel(item) : (item as { label: string }).label;
    if (label == null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.',
          'An item was provided without label in the `items` prop:',
          JSON.stringify(item),
        ].join('\n'),
      );
    }

    acc[item.id] = label || '';
    if (item.children) {
      const childrenLabels = getItemsLabels(item.children, getItemLabel);
      acc = { ...acc, ...childrenLabels };
    }
    return acc;
  }, {});
  return labels;
};

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({
  state,
  setState,
  params,
}) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    setState((prevState) => ({ ...prevState, editedItemId }));
  };
  const isItemBeingEdited = (itemId: TreeViewItemId) => itemId === state.editedItemId;

  const updateItemLabel = (itemId, label) => {
    setState((prevState) => {
      if (label !== prevState.labels[itemId]) {
        return {
          ...prevState,
          labels: {
            ...prevState.labels,
            [itemId]: label,
          },
          editedItemId: null,
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
    },
  };
};

useTreeViewLabel.getInitialState = (params) => ({
  editedItemId: null,
  labels: getItemsLabels(params.items, params.getItemLabel),
});

useTreeViewLabel.params = {
  items: true,
  getItemLabel: true,
  onItemLabelChange: true,
};
