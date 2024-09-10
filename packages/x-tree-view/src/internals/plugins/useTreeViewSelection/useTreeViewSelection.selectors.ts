import { createSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { TreeViewState } from '../../models';

export const selectorSelectedItemsMap = createSelector<
  [UseTreeViewSelectionSignature],
  Map<string, true>
>((state) => state.selection.selectedItemsMap);

export const selectorIsItemSelected = (
  state: TreeViewState<[UseTreeViewSelectionSignature]>,
  itemId: string,
) => {
  return selectorSelectedItemsMap(state).has(itemId);
};
