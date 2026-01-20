import { createSelector } from '@mui/x-internals/store';
import { MinimalTreeViewState } from '../../MinimalTreeViewStore';
import { TreeViewItemId } from '../../../models';

const treeIdSelector = createSelector(
  (state: MinimalTreeViewState<any, any>) => state.providedTreeId ?? state.treeId,
);

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
  treeItemIdAttribute: createSelector(
    treeIdSelector,
    (treeId, itemId: TreeViewItemId, providedIdAttribute: string | undefined) => {
      if (providedIdAttribute != null) {
        return providedIdAttribute;
      }

      return `${treeId ?? ''}-${itemId}`;
    },
  ),
};
