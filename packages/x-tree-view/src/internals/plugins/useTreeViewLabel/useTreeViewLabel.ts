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
    const isItemEditable = params.isItemEditable;
    store.update((prevState) => ({
      ...prevState,
      label: {
        ...prevState.label,
        isItemEditable: typeof isItemEditable === 'boolean' ? () => isItemEditable : isItemEditable,
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

useTreeViewLabel.getDefaultizedParams = ({ params }) => ({
  ...params,
  isItemEditable: params.isItemEditable ?? false,
});

useTreeViewLabel.getInitialState = ({ isItemEditable }) => ({
  label: {
    isItemEditable:
      typeof isItemEditable === 'boolean' ? () => isItemEditable as boolean : isItemEditable,
    editedItemId: null,
  },
});

useTreeViewLabel.params = {
  onItemLabelChange: true,
  isItemEditable: true,
};
