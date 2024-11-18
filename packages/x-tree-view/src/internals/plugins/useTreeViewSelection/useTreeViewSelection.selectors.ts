import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

const selectorTreeViewSelectionState: TreeViewRootSelector<UseTreeViewSelectionSignature> = (
  state,
) => state.selection;

/**
 * Check if an item is selected.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is selected, `false` otherwise.
 */
export const selectorIsItemSelected = createSelector(
  [selectorTreeViewSelectionState, (_, itemId: string) => itemId],
  (selectionState, itemId) => selectionState.selectedItemsMap.has(itemId),
);
