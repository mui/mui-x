import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

const selectorTreeViewIdState: TreeViewRootSelector<UseTreeViewIdSignature> = (state) => state.id;

export const selectorTreeViewId = createSelector(
  selectorTreeViewIdState,
  (idState) => idState.treeId,
);
