import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { TreeViewState } from '../../models';

export const selectorEditedItemId = (state: TreeViewState<[UseTreeViewLabelSignature]>) =>
  state.editedItemId;
