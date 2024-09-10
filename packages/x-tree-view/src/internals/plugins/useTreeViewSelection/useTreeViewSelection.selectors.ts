import { createSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { TreeViewState } from '../../models';

export const selectorSelectedItemsMap = (state: TreeViewState<[UseTreeViewSelectionSignature]>) =>
  state.selection.selectedItemsMap;

export const selectorIsItemSelected = createSelector(
  [selectorSelectedItemsMap, (_, itemId: string) => itemId],
  (selectedItemsMap, itemId) => selectedItemsMap.has(itemId),
);
