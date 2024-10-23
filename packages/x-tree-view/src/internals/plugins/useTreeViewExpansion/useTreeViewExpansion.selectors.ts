import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

const selectorExpansion: TreeViewRootSelector<UseTreeViewExpansionSignature> = (state) =>
  state.expansion;

export const selectorExpandedItemsMap = createSelector(
  selectorExpansion,
  (expansion) => expansion.expandedItemsMap,
);

export const selectorIsItemExpanded = createSelector(
  [selectorExpandedItemsMap, (_, itemId: string) => itemId],
  (expandedItemsMap, itemId) => expandedItemsMap.has(itemId),
);
