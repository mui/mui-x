import { createSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { TreeViewState } from '../../models';

export const selectorSelectedItemsMap = createSelector(
  (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectedItemsMap,
);

export const selectorIsItemSelected = createSelector(
  selectorSelectedItemsMap,
  (selectedItemsMap, itemId: string) => selectedItemsMap.has(itemId),
);
