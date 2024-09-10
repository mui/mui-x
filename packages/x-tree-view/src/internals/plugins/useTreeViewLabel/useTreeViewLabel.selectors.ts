import { createSelector } from '../../utils/selectors';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { TreeViewState } from '../../models';

export const selectorEditedItemId = createSelector(
  (state: TreeViewState<[UseTreeViewLabelSignature]>) => state.editedItemId,
);
