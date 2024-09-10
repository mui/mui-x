import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { createSelector } from '../../utils/selectors';
import { TreeViewState } from '../../models';

const selectorFocus = (state: TreeViewState<[UseTreeViewFocusSignature]>) => state.focus;

/**
 * Get the item that should be sequentially focusable (usually with the Tab key).
 * At any point in time, there is a single item that can be sequentially focused in the Tree View.
 * This item is the first selected item (that is both visible and navigable), if any, or the first navigable item if no item is selected.
 * @param {TreeViewInstance<[UseTreeViewFocusSignature]>} instance The instance of the tree view.
 * @returns {string} `true` if the item can be sequentially focusable, `false` otherwise.
 */
export const selectorDefaultFocusableItemId = createSelector(
  selectorFocus,
  (focus) => focus.defaultFocusableItemId,
);

export const selectorFocusedItemId = createSelector(selectorFocus, (focus) => focus.focusedItemId);

export const selectorIsItemFocused = createSelector(
  [selectorFocusedItemId, (_, itemId: string) => itemId],
  (focusedItemId, itemId) => focusedItemId === itemId,
);
