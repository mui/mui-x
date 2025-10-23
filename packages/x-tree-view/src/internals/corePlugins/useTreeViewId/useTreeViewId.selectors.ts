import { createSelector } from '@mui/x-internals/store';
import { MinimalTreeViewState } from '../../MinimalTreeViewStore';

export const idSelectors = {
  /**
   * Get the id attribute of the tree view.
   */
  treeId: createSelector((state: MinimalTreeViewState<any, any>) => state.treeId),
};
