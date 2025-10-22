import { createSelector } from '@mui/x-internals/store';
import { TreeViewState } from '../../TreeViewStore';

export const idSelectors = {
  /**
   * Get the id attribute of the tree view.
   */
  treeId: createSelector((state: TreeViewState<any>) => state.treeId),
};
