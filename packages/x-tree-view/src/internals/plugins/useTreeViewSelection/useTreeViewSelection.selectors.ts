import { createSelector, resolveState, StoreOrStateFromSignatures } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

export const selectorSelectedItemsMap = createSelector<
  UseTreeViewSelectionSignature,
  Map<string, true>
>((state) => state.selection.selectedItemsMap);

export const selectorIsItemSelected = (
  storeOrState: StoreOrStateFromSignatures<any[]>,
  itemId: string,
) => {
  return selectorSelectedItemsMap(resolveState(storeOrState)).has(itemId);
};
