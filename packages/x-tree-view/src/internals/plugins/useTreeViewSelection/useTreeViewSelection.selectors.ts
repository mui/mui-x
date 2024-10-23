import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

const selectorTreeViewSelectionState: TreeViewRootSelector<UseTreeViewSelectionSignature> = (
  state,
) => state.selection;

export const selectorSelectedItemsMap = createSelector(
  selectorTreeViewSelectionState,
  (selection) => selection.selectedItemsMap,
);

export const selectorIsItemSelected = createSelector(
  [selectorSelectedItemsMap, (_, itemId: string) => itemId],
  (selectedItemsMap, itemId) => selectedItemsMap.has(itemId),
);
