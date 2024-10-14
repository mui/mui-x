import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorItemMap } from '../useTreeViewItems/useTreeViewItems.selectors';

const selectorTreeViewLabelState: TreeViewRootSelector<UseTreeViewLabelSignature> = (state) =>
  state.label;

export const selectorEditedItemId = createSelector(
  selectorTreeViewLabelState,
  (labelState) => labelState.editedItemId,
);

export const selectorIsItemEditable = createSelector(
  [
    selectorItemMap,
    (_, args: { itemId: string; isItemEditable: ((item: any) => boolean) | boolean }) => args,
  ],
  (itemMap, args) => {
    const item = itemMap[args.itemId];
    if (!item || !args.isItemEditable) {
      return false;
    }

    return typeof args.isItemEditable === 'function' ? args.isItemEditable(item) : true;
  },
);

export const selectorIsItemBeingEdited = createSelector(
  [selectorEditedItemId, (_, itemId: string) => itemId],
  (editedItemId, itemId) => editedItemId === itemId,
);
