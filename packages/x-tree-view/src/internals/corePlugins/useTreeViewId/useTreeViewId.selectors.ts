import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

const selectorTreeViewIdState: TreeViewRootSelector<UseTreeViewIdSignature> = (state) => state.id;

/**
 * Get the id attribute of the tree view.
 * @param {TreeViewState<[UseTreeViewIdSignature]>} state The state of the tree view.
 * @returns {string} The id attribute of the tree view.
 */
export const selectorTreeViewId = createSelector(
  selectorTreeViewIdState,
  (idState) => idState.treeId,
);
