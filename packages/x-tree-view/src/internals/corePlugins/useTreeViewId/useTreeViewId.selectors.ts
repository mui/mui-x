import { createSelector } from '@base-ui-components/utils/store';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { TreeViewState } from '../../models';

const selectorTreeViewIdState = createSelector(
  (state: TreeViewState<[UseTreeViewIdSignature]>) => state.id,
);

/**
 * Get the id attribute of the tree view.
 * @param {TreeViewState<[UseTreeViewIdSignature]>} state The state of the tree view.
 * @returns {string} The id attribute of the tree view.
 */
export const selectorTreeViewId = createSelector(
  selectorTreeViewIdState,
  (idState) => idState.treeId,
);
