import { TreeViewPlugin } from '../../models';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { useTreeViewSelectionItemPlugin } from './useTreeViewSelection.itemPlugin';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({ params }) => {
  return {
    getRootProps: () => ({
      'aria-multiselectable': params.multiSelect,
    }),
    publicAPI: {
      setItemSelection,
    },
    instance: {},
  };
};

useTreeViewSelection.itemPlugin = useTreeViewSelectionItemPlugin;

useTreeViewSelection.params = {
  disableSelection: true,
  multiSelect: true,
  checkboxSelection: true,
  defaultSelectedItems: true,
  selectedItems: true,
  onSelectedItemsChange: true,
  onItemSelectionToggle: true,
  selectionPropagation: true,
};
