import { createSelector } from '../../utils/selectors';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

export const selectorEditedItemId = createSelector<[UseTreeViewLabelSignature], string | null>(
  (state) => state.editedItemId,
);
