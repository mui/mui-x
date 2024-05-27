import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';

import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({
  state,
  setState,
}) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    setState((prevState) => ({ ...prevState, editedItemId }));
  };
  const isItemBeingEdited = (itemId: TreeViewItemId) => itemId === state.editedItemId;

  return {
    instance: {
      setEditedItemId,
      isItemBeingEdited,
    },
  };
};

useTreeViewLabel.getInitialState = () => ({ editedItemId: null });

useTreeViewLabel.params = {
  label: true,
};
