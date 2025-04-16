import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { useTreeViewLabelItemPlugin } from './useTreeViewLabel.itemPlugin';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({ store, params }) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    store.update((prevState) => ({ ...prevState, label: { ...prevState.label, editedItemId } }));
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
    store.update((prevState) => {
      const item = prevState.items.itemMetaLookup[itemId];
      if (item.label !== label) {
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaLookup: { ...prevState.items.itemMetaLookup, [itemId]: { ...item, label } },
          },
        };
      }

      return prevState;
    });

    if (params.onItemLabelChange) {
      params.onItemLabelChange(itemId, label);
    }
  };

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      label: {
        ...prevState.label,
        isItemEditable: params.isItemEditable,
      },
    }));
  }, [store, params.isItemEditable]);

  return {
    instance: {
      setEditedItemId,
      updateItemLabel,
    },
    publicAPI: {
      updateItemLabel,
    },
  };
};

useTreeViewLabel.itemPlugin = useTreeViewLabelItemPlugin;

useTreeViewLabel.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  isItemEditable: params.isItemEditable ?? false,
});

useTreeViewLabel.getInitialState = (params) => ({
  label: {
    isItemEditable: params.isItemEditable,
    editedItemId: null,
  },
});

useTreeViewLabel.params = {
  onItemLabelChange: true,
  isItemEditable: true,
};
