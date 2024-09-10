import { createSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { TreeViewState } from '../../models';

export const selectorTreeViewId = (state: TreeViewState<[UseTreeViewIdSignature]>) =>
  state.id.treeId ?? '';

export const selectorTreeItemIdAttribute = createSelector(
  [selectorTreeViewId, (_, args: { itemId: string; idAttribute: string | undefined }) => args],
  (treeId, args) => {
    if (args.idAttribute != null) {
      return args.idAttribute;
    }

    return `${treeId}-${args.itemId}`;
  },
);
