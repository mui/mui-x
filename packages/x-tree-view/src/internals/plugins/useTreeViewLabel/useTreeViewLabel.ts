import { TreeViewPlugin } from '../../models';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';

import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({
  instance,
  // models,
  params,
  state,
  setState,
}) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    setState((prevState) => ({ ...prevState, editedItemId }));
  };

  const isItemBeingEdited = (itemId: TreeViewItemId) => itemId === state.editedItemId;

  console.log(state);
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
