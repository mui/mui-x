import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { useTreeViewLabelItemPlugin } from './useTreeViewLabel.itemPlugin';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({ store, params }) => {
  useIsoLayoutEffect(() => {
    store.set('label', { ...store.state.items, isItemEditable: params.isItemEditable });
  }, [store, params.isItemEditable]);

  return {
    instance: {},
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
