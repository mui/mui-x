import { createSelector } from '../../utils/createSelector';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';

export const selectorEditedItemId = createSelector<UseTreeViewLabelSignature, string | null>(
  (storeValue) => storeValue.editedItemId,
);
