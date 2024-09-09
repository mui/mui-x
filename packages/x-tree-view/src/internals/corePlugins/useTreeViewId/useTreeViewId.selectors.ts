import { createSelector, resolveState, StoreOrStateFromSignatures } from '../../utils/selectors';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const selectorTreeViewId = createSelector<UseTreeViewIdSignature, string>(
  (state) => state.id.treeId ?? '',
);

export const selectorTreeItemIdAttribute = (
  storeOrState: StoreOrStateFromSignatures<any[]>,
  itemId: string,
  idAttribute: string | undefined,
) => {
  if (idAttribute != null) {
    return idAttribute;
  }

  const state = resolveState(storeOrState);
  const treeId = selectorTreeViewId(state);
  return `${treeId}-${itemId}`;
};
