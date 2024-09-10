import { createSelector } from '../../utils/selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';
import { TreeViewState } from '../../models';

export const selectorExpandedItemsMap = createSelector(
  (state: TreeViewState<[UseTreeViewExpansionSignature]>) => state.expansion.expandedItemsMap,
);

export const selectorIsItemExpanded = createSelector(
  selectorExpandedItemsMap,
  (expandedItemsMap, itemId: string) => expandedItemsMap.has(itemId),
);
