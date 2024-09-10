import { createSelector } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { TreeViewState } from '../../models';

export const selectorTreeViewId = createSelector<[UseTreeViewIdSignature], string>(
  (state) => state.id.treeId ?? '',
);

export const selectorTreeItemIdAttribute = <TState extends TreeViewState<[UseTreeViewIdSignature]>>(
  state: TState,
  itemId: string,
  idAttribute: string | undefined,
) => {
  if (idAttribute != null) {
    return idAttribute;
  }

  const treeId = selectorTreeViewId(state);
  return `${treeId}-${itemId}`;
};
