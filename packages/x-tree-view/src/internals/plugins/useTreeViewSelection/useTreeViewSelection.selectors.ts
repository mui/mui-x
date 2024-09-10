import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import {
  UseTreeViewSelectionSignature,
  UseTreeViewSelectionState,
} from './useTreeViewSelection.types';

const selectorSelection: TreeViewRootSelector<
  [UseTreeViewSelectionSignature],
  UseTreeViewSelectionState['selection']
> = (state) => state.selection;

export const selectorSelectedItemsMap = createSelector(
  selectorSelection,
  (selection) => selection.selectedItemsMap,
);

export const selectorIsItemSelected = createSelector(
  [selectorSelectedItemsMap, (_, itemId: string) => itemId],
  (selectedItemsMap, itemId) => selectedItemsMap.has(itemId),
);
