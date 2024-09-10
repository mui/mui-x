import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const selectorTreeViewId: TreeViewRootSelector<[UseTreeViewIdSignature], string> = (state) =>
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
