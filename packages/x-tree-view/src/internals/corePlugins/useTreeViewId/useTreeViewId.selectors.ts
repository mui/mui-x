import { createSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { TreeViewState } from '../../models';

export const selectorTreeViewId = createSelector(
  (state: TreeViewState<[UseTreeViewIdSignature]>) => state.id.treeId ?? '',
);

export const selectorTreeItemIdAttribute = createSelector(
  selectorTreeViewId,
  (treeId, args: { itemId: string; idAttribute: string | undefined }) => {
    if (args.idAttribute != null) {
      return args.idAttribute;
    }

    return `${treeId}-${args.itemId}`;
  },
);
