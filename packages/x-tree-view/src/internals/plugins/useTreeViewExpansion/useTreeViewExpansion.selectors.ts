import { createSelector } from '../../utils/selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';
import { TreeViewState } from '../../models';

export const selectorExpandedItemsMap = (state: TreeViewState<[UseTreeViewExpansionSignature]>) =>
  state.expansion.expandedItemsMap;

export const selectorIsItemExpanded = createSelector(
  [selectorExpandedItemsMap, (_, itemId: string) => itemId],
  (expandedItemsMap, itemId) => expandedItemsMap.has(itemId),
);
