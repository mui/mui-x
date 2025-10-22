import { TreeViewPlugin } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = () => {
  return {
    publicAPI: {
      focusItem,
    },
    instance: {},
  };
};

useTreeViewFocus.params = {
  onItemFocus: true,
};
