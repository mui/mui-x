import { TreeViewItemId } from '../../models';
import { selectionSelectors } from '../plugins/useTreeViewSelection';
import {
  getAddedAndRemovedItems,
  getLookupFromArray,
  propagateSelection,
} from '../plugins/useTreeViewSelection/useTreeViewSelection.utils';
import {
  findOrderInTremauxTree,
  getAllNavigableItems,
  getFirstNavigableItem,
  getLastNavigableItem,
  getNonDisabledItemsInRange,
} from '../utils/tree';
import type { TreeViewStore } from './TreeViewStore';
import { TreeViewSelectionValue } from './TreeViewStore.types';

export class TreeViewSelectionManager<
  Multiple extends boolean | undefined,
  Store extends TreeViewStore<any, Multiple, any, any>,
> {
  private store: Store;

  private lastSelectedItem: TreeViewItemId | null = null;

  private lastSelectedRange: Record<string, boolean> = {};

  constructor(store: Store) {
    this.store = store;
  }

  private setSelectedItems = (
    event: React.SyntheticEvent | null,
    newModel: string[] | string | null,
    additionalItemsToPropagate?: TreeViewItemId[],
  ) => {
    const { selectionPropagation, selectedItems, onItemSelectionToggle, onSelectedItemsChange } =
      this.store.parameters;

    const oldModel = selectionSelectors.selectedItemsRaw(this.store.state);
    let cleanModel: string[] | string | null;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);

    if (
      isMultiSelectEnabled &&
      (selectionPropagation.descendants || selectionPropagation.parents)
    ) {
      cleanModel = propagateSelection({
        store: this.store,
        selectionPropagation,
        newModel: newModel as string[],
        oldModel: oldModel as string[],
        additionalItemsToPropagate,
      });
    } else {
      cleanModel = newModel;
    }

    if (onItemSelectionToggle) {
      if (isMultiSelectEnabled) {
        const changes = getAddedAndRemovedItems({
          store: this.store,
          newModel: cleanModel as string[],
          oldModel: oldModel as string[],
        });

        if (onItemSelectionToggle) {
          changes.added.forEach((itemId) => {
            onItemSelectionToggle!(event, itemId, true);
          });

          changes.removed.forEach((itemId) => {
            onItemSelectionToggle!(event, itemId, false);
          });
        }
      } else if (onItemSelectionToggle && cleanModel !== oldModel) {
        if (oldModel != null) {
          onItemSelectionToggle(event, oldModel as string, false);
        }
        if (cleanModel != null) {
          onItemSelectionToggle(event, cleanModel as string, true);
        }
      }
    }

    if (selectedItems === undefined) {
      this.store.set('selectedItems', cleanModel);
    }

    onSelectedItemsChange?.(event, cleanModel);
  };

  private selectRange = (event: React.SyntheticEvent, [start, end]: [string, string]) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectionSelectors.selectedItems(this.store.state).slice();

    // If the last selection was a range selection,
    // remove the items that were part of the last range from the model
    if (Object.keys(this.lastSelectedRange).length > 0) {
      newSelectedItems = newSelectedItems.filter((id) => !this.lastSelectedRange[id]);
    }

    // Add to the model the items that are part of the new range and not already part of the model.
    const selectedItemsLookup = getLookupFromArray(newSelectedItems);
    const range = getNonDisabledItemsInRange(this.store.state, start, end);
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);

    this.setSelectedItems(event, newSelectedItems);
    this.lastSelectedRange = getLookupFromArray(range);
  };

  public setItemSelection = ({
    itemId,
    event = null,
    keepExistingSelection = false,
    shouldBeSelected,
  }: {
    itemId: string;
    event?: React.SyntheticEvent | null;
    shouldBeSelected?: boolean;
    keepExistingSelection?: boolean;
  }) => {
    if (!selectionSelectors.enabled(this.store.state)) {
      return;
    }

    let newSelected: TreeViewSelectionValue<boolean>;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (keepExistingSelection) {
      const oldSelected = selectionSelectors.selectedItems(this.store.state);
      const isSelectedBefore = selectionSelectors.isItemSelected(this.store.state, itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = oldSelected.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(oldSelected);
      } else {
        newSelected = oldSelected;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (
        shouldBeSelected === false ||
        (shouldBeSelected == null && selectionSelectors.isItemSelected(this.store.state, itemId))
      ) {
        newSelected = isMultiSelectEnabled ? [] : null;
      } else {
        newSelected = isMultiSelectEnabled ? [itemId] : itemId;
      }
    }

    this.setSelectedItems(
      event,
      newSelected,
      // If shouldBeSelected === selectionSelectors.isItemSelected(store, itemId), we still want to propagate the select.
      // This is useful when the element is in an indeterminate state.
      [itemId],
    );
    this.lastSelectedItem = itemId;
    this.lastSelectedRange = {};
  };

  public selectAllNavigableItems = (event: React.SyntheticEvent) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    const navigableItems = getAllNavigableItems(this.store.state);
    this.setSelectedItems(event, navigableItems);

    this.lastSelectedRange = getLookupFromArray(navigableItems);
  };

  public expandSelectionRange = (event: React.SyntheticEvent, itemId: string) => {
    if (this.lastSelectedItem != null) {
      const [start, end] = findOrderInTremauxTree(this.store.state, itemId, this.lastSelectedItem);
      this.selectRange(event, [start, end]);
    }
  };

  public selectRangeFromStartToItem = (event: React.SyntheticEvent, itemId: string) => {
    this.selectRange(event, [getFirstNavigableItem(this.store.state), itemId]);
  };

  public selectRangeFromItemToEnd = (event: React.SyntheticEvent, itemId: string) => {
    this.selectRange(event, [itemId, getLastNavigableItem(this.store.state)]);
  };

  public selectItemFromArrowNavigation = (
    event: React.SyntheticEvent,
    currentItem: string,
    nextItem: string,
  ) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectionSelectors.selectedItems(this.store.state).slice();

    if (Object.keys(this.lastSelectedRange).length === 0) {
      newSelectedItems.push(nextItem);
      this.lastSelectedRange = { [currentItem]: true, [nextItem]: true };
    } else {
      if (!this.lastSelectedRange[currentItem]) {
        this.lastSelectedRange = {};
      }

      if (this.lastSelectedRange[nextItem]) {
        newSelectedItems = newSelectedItems.filter((id) => id !== currentItem);
        delete this.lastSelectedRange[currentItem];
      } else {
        newSelectedItems.push(nextItem);
        this.lastSelectedRange[nextItem] = true;
      }
    }

    this.setSelectedItems(event, newSelectedItems);
  };
}
