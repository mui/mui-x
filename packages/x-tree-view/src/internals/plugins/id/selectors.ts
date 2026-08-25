import type { MinimalTreeViewState } from '../../MinimalTreeViewStore';
import type { TreeViewItemId } from '../../../models';

const treeIdSelector = (state: MinimalTreeViewState<any, any>) =>
  state.providedTreeId ?? state.treeId;

export const idSelectors = {
  /**
   * Get the id attribute of the tree view.
   */
  treeId: treeIdSelector,
  /**
   * Generate the id attribute (i.e.: the `id` attribute passed to the DOM element) of a Tree Item.
   * If the user explicitly defined an id attribute, it will be returned.
   * Otherwise, the method creates a unique id for the item based on the Tree View id attribute and the item `itemId`
   */
  treeItemIdAttribute: (
    state: MinimalTreeViewState<any, any>,
    itemId: TreeViewItemId,
    providedIdAttribute: string | undefined,
  ) => {
    if (providedIdAttribute != null) {
      return providedIdAttribute;
    }

    return `${treeIdSelector(state) ?? ''}-${itemId}`;
  },
};
