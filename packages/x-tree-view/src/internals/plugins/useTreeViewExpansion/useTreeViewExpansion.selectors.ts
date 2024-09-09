import { createSelector } from '../../utils/createSelector';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const selectorExpandedItemsMap = createSelector<
  UseTreeViewExpansionSignature,
  Map<string, boolean>
>((storeValue) => storeValue.expansion.expandedItemsMap);
