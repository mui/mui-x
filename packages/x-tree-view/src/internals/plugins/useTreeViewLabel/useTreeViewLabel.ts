import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { useTreeViewLabelItemPlugin } from './useTreeViewLabel.itemPlugin';
import { labelSelectors } from './useTreeViewLabel.selectors';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({ store, params }) => {
  const setEditedItem = (editedItemId: TreeViewItemId | null) => {
    if (editedItemId !== null) {
      const isEditable = labelSelectors.isItemEditable(store.state, editedItemId);

      if (!isEditable) {
        return;
      }
    }

    store.set('label', { ...store.state.label, editedItemId });
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

    const item = store.state.items.itemMetaLookup[itemId];
    if (item.label === label) {
      return;
    }

    store.set('items', {
      ...store.state.items,
      itemMetaLookup: { ...store.state.items.itemMetaLookup, [itemId]: { ...item, label } },
    });

    if (params.onItemLabelChange) {
      params.onItemLabelChange(itemId, label);
    }
  };

  useEnhancedEffect(() => {
    store.set('label', { ...store.state.items, isItemEditable: params.isItemEditable });
  }, [store, params.isItemEditable]);

  return {
    instance: {
      setEditedItem,
      updateItemLabel,
    },
    publicAPI: {
      setEditedItem,
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
