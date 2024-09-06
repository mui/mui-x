import { createSelector } from '../../utils/createSelector';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const treeViewExpandedItemsMapSelector = createSelector<
  UseTreeViewExpansionSignature,
  Map<string, boolean>
>((storeValue) => storeValue.cache.expandedItemsMap);
