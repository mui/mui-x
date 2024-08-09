import * as React from 'react';
import { warnOnce } from '../../utils/warning';
import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { useTreeViewLabelItemPlugin } from './useTreeViewLabel.itemPlugin';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({
  instance,
  state,
  setState,
  params,
  experimentalFeatures,
}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (params.isItemEditable && !experimentalFeatures?.labelEditing) {
      warnOnce([
        'MUI X: The label editing feature requires the `labelEditing` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ labelEditing: true}}` to the `RichTreeViewPro` component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/editing/',
      ]);
    }
  }
  const editedItemRef = React.useRef(state.editedItemId);

  const isItemBeingEditedRef = (itemId: TreeViewItemId) => editedItemRef.current === itemId;

  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    setState((prevState) => ({ ...prevState, editedItemId }));
    editedItemRef.current = editedItemId;
  };

  const isItemBeingEdited = (itemId: TreeViewItemId) => itemId === state.editedItemId;

  const isTreeViewEditable = Boolean(params.isItemEditable) && !!experimentalFeatures.labelEditing;

  const isItemEditable = (itemId: TreeViewItemId): boolean => {
    if (itemId == null || !isTreeViewEditable) {
      return false;
    }
    const item = instance.getItem(itemId);

    if (!item) {
      return false;
    }
    return typeof params.isItemEditable === 'function'
      ? params.isItemEditable(item)
      : Boolean(params.isItemEditable);
  };

  const updateItemLabel = (itemId: TreeViewItemId, label: string) => {
    if (!label) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'The label of an item cannot be empty.',
          itemId,
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
      isItemBeingEditedRef,
    },
    publicAPI: {
      updateItemLabel,
    },
  };
};

useTreeViewLabel.itemPlugin = useTreeViewLabelItemPlugin;

useTreeViewLabel.getInitialState = () => ({
  editedItemId: null,
});

useTreeViewLabel.params = {
  onItemLabelChange: true,
  isItemEditable: true,
};
