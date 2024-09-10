import { createSelector } from '../../utils/selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';
import { TreeViewState } from '../../models';

export const selectorExpandedItemsMap = createSelector<
  [UseTreeViewExpansionSignature],
  Map<string, true>
>((state) => state.expansion.expandedItemsMap);

export const selectorIsItemExpanded = (
  state: TreeViewState<[UseTreeViewExpansionSignature]>,
  itemId: string,
) => {
  return selectorExpandedItemsMap(state).has(itemId);
};
