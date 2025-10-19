import { createSelector } from '@mui/x-internals/store';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { TreeViewState } from '../../models';

export const idSelectors = {
  /**
   * Get the id attribute of the tree view.
   * @param {TreeViewState<[UseTreeViewIdSignature]>} state The state of the tree view.
   * @returns {string} The id attribute of the tree view.
   */
  treeId: createSelector((state: TreeViewState<[UseTreeViewIdSignature]>) => state.id.treeId),
};
